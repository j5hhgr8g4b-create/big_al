import { defineConfig, devices } from "@playwright/test";

const visualPort = 3108;
const visualBaseUrl = `http://127.0.0.1:${visualPort}`;

export default defineConfig({
  testDir: "./tests/visual",
  testMatch: "**/*.visual.spec.ts",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  outputDir: "test-results",
  snapshotPathTemplate: "{testDir}/../visual-snapshots/{projectName}/{arg}{ext}",
  expect: {
    toHaveScreenshot: {
      animations: "disabled",
      caret: "hide",
      maxDiffPixelRatio: 0.02,
      scale: "device",
      threshold: 0.2,
    },
  },
  use: {
    ...devices["Desktop Chrome"],
    baseURL: visualBaseUrl,
    colorScheme: "light",
    contextOptions: { reducedMotion: "reduce" },
    trace: "retain-on-failure",
  },
  webServer: {
    command: `pnpm exec next dev --hostname 127.0.0.1 --port ${visualPort}`,
    url: `${visualBaseUrl}/__visual/kitchen`,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      BIG_AL_VISUAL_TEST: "1",
      NEXT_PUBLIC_SUPABASE_URL:
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://visual-test.supabase.co",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "visual-test-publishable-key",
    },
  },
  projects: [
    {
      name: "kitchen-320",
      use: { viewport: { width: 320, height: 884 }, deviceScaleFactor: 1 },
    },
    {
      name: "kitchen-375",
      use: { viewport: { width: 375, height: 884 }, deviceScaleFactor: 1 },
    },
    {
      name: "kitchen-390",
      use: { viewport: { width: 390, height: 884 }, deviceScaleFactor: 1 },
    },
    {
      name: "kitchen-430",
      use: { viewport: { width: 430, height: 884 }, deviceScaleFactor: 1 },
    },
    {
      name: "stitch-reference",
      use: { viewport: { width: 390, height: 884 }, deviceScaleFactor: 2 },
    },
  ],
});
