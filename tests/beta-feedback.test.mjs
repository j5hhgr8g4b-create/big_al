import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  normalizeFeedbackPagePath,
  validateFeedbackCategory,
  validateFeedbackText,
} from "../src/lib/beta/feedback.ts";

test("accepts every supported beta feedback category", () => {
  for (const category of ["problem", "confusing", "recipe", "expected", "general"]) {
    assert.equal(validateFeedbackCategory(category), category);
  }
});

test("rejects unsupported beta feedback categories", () => {
  assert.equal(validateFeedbackCategory(""), null);
  assert.equal(validateFeedbackCategory("admin"), null);
});

test("accepts useful feedback and trims surrounding whitespace", () => {
  assert.equal(validateFeedbackText("  The shopping list did not update.  "), "The shopping list did not update.");
});

test("rejects feedback that is too short or too long", () => {
  assert.equal(validateFeedbackText("Too short"), null);
  assert.equal(validateFeedbackText("x".repeat(4001)), null);
});

test("keeps a safe current page path and rejects external or malformed paths", () => {
  assert.equal(normalizeFeedbackPagePath("/cookbook/recipes/123/cook"), "/cookbook/recipes/123/cook");
  assert.equal(normalizeFeedbackPagePath("https://example.com"), "/");
  assert.equal(normalizeFeedbackPagePath("//example.com"), "/");
  assert.equal(normalizeFeedbackPagePath("/" + "x".repeat(300)), "/");
});

test("feedback migration enforces authenticated Restaurant scoping", async () => {
  const migration = await readFile(
    new URL("../supabase/migrations/20260812202748_m21_beta_feedback.sql", import.meta.url),
    "utf8",
  );

  assert.match(migration, /alter table public\.beta_feedback enable row level security/i);
  assert.match(migration, /current_user_id uuid := auth\.uid\(\)/i);
  assert.match(migration, /if not public\.is_restaurant_member\(target_restaurant_id\)/i);
  assert.match(migration, /submitted_by = \(select auth\.uid\(\)\)/i);
  assert.match(migration, /revoke all on table public\.beta_feedback from public, anon, authenticated/i);
  assert.match(migration, /grant select on table public\.beta_feedback to authenticated/i);
  assert.doesNotMatch(migration, /grant insert on table public\.beta_feedback/i);
  assert.match(
    migration,
    /grant execute on function public\.submit_beta_feedback\(uuid, text, text, text\) to authenticated/i,
  );
});
