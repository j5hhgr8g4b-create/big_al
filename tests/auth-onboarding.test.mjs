import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { resolveAuthRedirectOrigin } from "../src/lib/auth/redirect-origin.ts";

test("uses the configured public site URL for auth redirects", () => {
  assert.equal(
    resolveAuthRedirectOrigin({
      configuredSiteUrl: "https://beta.big-al.example/path",
      requestOrigin: "https://ignored.example",
    }),
    "https://beta.big-al.example",
  );
});

test("uses the current request origin for a forwarded Codespaces preview", () => {
  assert.equal(
    resolveAuthRedirectOrigin({
      requestOrigin: "https://example-3000.app.github.dev",
    }),
    "https://example-3000.app.github.dev",
  );
});

test("prefers the public forwarded origin over an internal localhost request origin", () => {
  assert.equal(
    resolveAuthRedirectOrigin({
      requestOrigin: "https://localhost:3000",
      forwardedHost: "bug-free-rotary-phone-r7q7v5xxqp73pqpp-3000.app.github.dev",
      forwardedProto: "https",
    }),
    "https://bug-free-rotary-phone-r7q7v5xxqp73pqpp-3000.app.github.dev",
  );
});

test("builds a safe origin from forwarded headers and rejects unsafe values", () => {
  assert.equal(
    resolveAuthRedirectOrigin({
      forwardedHost: "example-3000.app.github.dev",
      forwardedProto: "https",
      requestOrigin: "javascript:alert(1)",
    }),
    "https://example-3000.app.github.dev",
  );
  assert.equal(
    resolveAuthRedirectOrigin({ requestOrigin: "javascript:alert(1)" }),
    "http://localhost:3000",
  );
});

test("auth screens expose signup and password recovery backed by Supabase Auth", async () => {
  const [loginPage, signupActions, resetActions, updateActions, callback, nextConfig] = await Promise.all([
    readFile(new URL("../src/app/(auth)/login/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/app/(auth)/login/actions.ts", import.meta.url), "utf8"),
    readFile(new URL("../src/app/(auth)/forgot-password/actions.ts", import.meta.url), "utf8"),
    readFile(new URL("../src/app/(auth)/update-password/actions.ts", import.meta.url), "utf8"),
    readFile(new URL("../src/app/auth/callback/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../next.config.ts", import.meta.url), "utf8"),
  ]);

  assert.match(loginPage, /href="\/signup"/);
  assert.match(loginPage, /href="\/forgot-password"/);
  assert.match(signupActions, /supabase\.auth\.signUp/);
  assert.match(signupActions, /emailRedirectTo: `\$\{redirectOrigin\}\/auth\/callback`/);
  assert.match(resetActions, /supabase\.auth\.resetPasswordForEmail/);
  assert.match(resetActions, /\/auth\/callback\?next=\/update-password/);
  assert.match(updateActions, /supabase\.auth\.updateUser\(\{ password \}\)/);
  assert.match(updateActions, /supabase\.auth\.signOut\(\)/);
  assert.match(callback, /exchangeCodeForSession/);
  assert.match(nextConfig, /"\*\.app\.github\.dev"/);
  assert.doesNotMatch(nextConfig, /bug-free-rotary-phone/);
});
