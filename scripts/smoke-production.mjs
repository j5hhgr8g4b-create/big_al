#!/usr/bin/env node

const defaultOrigin = "https://big-al-kappa.vercel.app";
const origin = (process.env.BIG_AL_BETA_URL ?? defaultOrigin).replace(/\/$/, "");
const paths = ["/login", "/", "/auth/callback"];

function fail(message) {
  console.error(`Production smoke check failed: ${message}`);
  process.exitCode = 1;
}

function isExpectedStatus(status) {
  return status >= 200 && status < 400;
}

if (!/^https:\/\//.test(origin)) {
  fail(`BIG_AL_BETA_URL must be an HTTPS origin (received ${origin}).`);
} else if (/\.app\.github\.dev$/i.test(new URL(origin).hostname)) {
  fail("the configured origin is a Codespaces host, not the production beta origin.");
}

if (process.exitCode) {
  process.exit();
}

for (const path of paths) {
  const url = `${origin}${path}`;

  try {
    const response = await fetch(url, { redirect: "manual" });
    const server = response.headers.get("server") ?? "";
    const poweredBy = response.headers.get("x-powered-by") ?? "";

    if (!isExpectedStatus(response.status)) {
      fail(`${path} returned HTTP ${response.status}; inspect the deployment/runtime logs.`);
      continue;
    }

    if (path === "/" && response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location") ?? "";
      if (!location.includes("/login")) {
        fail(`${path} redirected to an unexpected location.`);
        continue;
      }
    }

    if (server.toLowerCase() !== "vercel" && poweredBy.toLowerCase() !== "next.js") {
      fail(`${path} did not identify Vercel/Next.js production response headers.`);
      continue;
    }

    console.log(`PASS ${path} HTTP ${response.status}`);
  } catch (error) {
    fail(`${path} could not be reached (${error instanceof Error ? error.message : "unknown error"}).`);
  }
}

if (!process.exitCode) {
  console.log(`Production smoke check passed for ${origin}`);
}
