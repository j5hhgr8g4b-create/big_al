import { expect, test, type Locator } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

type Box = { height: number; width: number; x: number; y: number };

const referenceBoxes: Record<string, Box> = {
  "kitchen-header": { x: 0, y: 0, width: 390, height: 64 },
  "kitchen-hero": { x: 24, y: 64, width: 342, height: 195 },
  "kitchen-week": { x: 24, y: 275, width: 342, height: 149 },
  "kitchen-pantry": { x: 24, y: 440, width: 342, height: 90 },
  "kitchen-says": { x: 24, y: 546, width: 342, height: 165 },
  "kitchen-nav": { x: 0, y: 781, width: 390, height: 103 },
};

const referenceInnerBoxes: Record<string, Partial<Box>> = {
  "kitchen-hero-action": { x: 44, y: 199, height: 40 },
  "kitchen-hero-image": { x: 234, y: 84, width: 112, height: 112 },
  "kitchen-hero-kicker": { x: 44, y: 84, height: 15 },
  "kitchen-hero-meta": { x: 44, y: 155, height: 20 },
  "kitchen-hero-title": { x: 44, y: 107, height: 40 },
};

async function waitForVisualAssets(pageRoot: Locator) {
  await pageRoot.evaluate(async (root) => {
    await document.fonts.ready;

    const images = Array.from(root.querySelectorAll("img"));
    await Promise.all(
      images.map(async (image) => {
        if (!image.complete) {
          await new Promise<void>((resolve, reject) => {
            image.addEventListener("load", () => resolve(), { once: true });
            image.addEventListener("error", () => reject(new Error(`Image failed: ${image.src}`)), {
              once: true,
            });
          });
        }

        await image.decode();
      }),
    );
  });
}

test("reproduces the Stitch Kitchen and remains overflow-safe", async ({ page }, testInfo) => {
  await page.goto("/__visual/kitchen", { waitUntil: "networkidle" });

  const screen = page.getByTestId("kitchen-screen");
  await expect(screen).toBeVisible();
  await waitForVisualAssets(screen);

  const visibleCopy = await screen.innerText();
  expect(visibleCopy).toContain("Big Al's Kitchen");
  expect(visibleCopy).toContain("Creamy Garlic Sausages");
  expect(visibleCopy).toContain("Let's Cook");
  expect(visibleCopy).toContain('"A good sausage makes everything better."');
  expect(visibleCopy).not.toMatch(/&(?:apos|amp|quot);/);

  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Kitchen", exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );

  const overflow = await page.evaluate(() => ({
    documentClientWidth: document.documentElement.clientWidth,
    documentScrollWidth: document.documentElement.scrollWidth,
    screenClientWidth: document.querySelector<HTMLElement>('[data-testid="kitchen-screen"]')
      ?.clientWidth,
    screenScrollWidth: document.querySelector<HTMLElement>('[data-testid="kitchen-screen"]')
      ?.scrollWidth,
  }));

  expect(overflow.documentScrollWidth).toBeLessThanOrEqual(overflow.documentClientWidth);
  expect(overflow.screenScrollWidth).toBeLessThanOrEqual(overflow.screenClientWidth ?? 0);

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  const scrolledSaysBox = await page.getByTestId("kitchen-says").boundingBox();
  const fixedNavBox = await page.getByTestId("kitchen-nav").boundingBox();
  expect(scrolledSaysBox?.y ?? Number.POSITIVE_INFINITY).toBeGreaterThanOrEqual(0);
  expect(
    (scrolledSaysBox?.y ?? 0) + (scrolledSaysBox?.height ?? Number.POSITIVE_INFINITY),
    "Big Al Says content must scroll completely above the fixed navigation",
  ).toBeLessThanOrEqual(fixedNavBox?.y ?? 0);
  await page.evaluate(() => window.scrollTo(0, 0));

  if (testInfo.project.name === "stitch-reference") {
    const [checkedBaseline, preservedSource] = await Promise.all([
      readFile(resolve(process.cwd(), "tests/visual-snapshots/stitch-reference/kitchen.png")),
      readFile(resolve(process.cwd(), "docs/stitch/reference/KITCHEN_SOURCE.png")),
    ]);
    expect(
      checkedBaseline.equals(preservedSource),
      "the authoritative Stitch baseline must never be regenerated from the implementation",
    ).toBe(true);

    for (const [testId, expectedBox] of Object.entries(referenceBoxes)) {
      const actualBox = await page.getByTestId(testId).boundingBox();
      expect(actualBox, `${testId} must have a measurable box`).not.toBeNull();

      for (const property of ["x", "y", "width", "height"] as const) {
        expect(
          actualBox?.[property],
          `${testId}.${property} differs from the Stitch source`,
        ).toBeCloseTo(expectedBox[property], 1);
      }
    }

    for (const [testId, expectedBox] of Object.entries(referenceInnerBoxes)) {
      const actualBox = await page.getByTestId(testId).boundingBox();
      expect(actualBox, `${testId} must have a measurable box`).not.toBeNull();

      for (const [property, expectedValue] of Object.entries(expectedBox)) {
        expect(
          actualBox?.[property as keyof Box],
          `${testId}.${property} differs from the Stitch source`,
        ).toBeCloseTo(expectedValue, 1);
      }
    }

    await expect(page.getByTestId("kitchen-hero-title")).toHaveCSS("font-size", "16px");
    await expect(page.getByTestId("kitchen-hero-title")).toHaveCSS("line-height", "20px");
    await expect(page.getByTestId("kitchen-hero-image").locator("img")).toHaveCSS(
      "object-fit",
      "cover",
    );
  }

  await expect(page).toHaveScreenshot("kitchen.png");
});
