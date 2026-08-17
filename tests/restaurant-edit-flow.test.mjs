import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const newRestaurantPage = await readFile(
  new URL("../src/app/(app)/restaurants/new/page.tsx", import.meta.url),
  "utf8",
);
const preferencesActions = await readFile(
  new URL("../src/app/(app)/restaurants/preferences/actions.ts", import.meta.url),
  "utf8",
);

test("existing Restaurant members are sent from creation to settings", () => {
  assert.match(newRestaurantPage, /getCurrentRestaurant\(\)/);
  assert.match(newRestaurantPage, /if \(restaurant\) \{\s*redirect\("\/restaurants\/preferences"\)/);
});

test("Restaurant name edits retain validation and owner-scoped RLS", () => {
  assert.match(preferencesActions, /name\.length < 1 \|\| name\.length > 100/);
  assert.match(preferencesActions, /\.from\("restaurants"\)\s*\.update\(\{ name \}\)/);
  assert.match(preferencesActions, /\.eq\("id", restaurantId\)/);
  assert.match(preferencesActions, /Only the Restaurant owner can change its name/);
});
