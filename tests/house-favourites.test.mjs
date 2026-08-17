import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";

const migration = await readFile(
  new URL("../supabase/migrations/20260817130000_house_favourites.sql", import.meta.url),
  "utf8",
);

test("House Favourites are Restaurant-scoped and attributed", () => {
  assert.match(migration, /create table if not exists public\.house_favourites/i);
  assert.match(migration, /restaurant_id uuid not null references public\.restaurants/i);
  assert.match(migration, /recipe_id uuid not null references public\.recipes/i);
  assert.match(migration, /marked_by_profile_id uuid not null references public\.profiles/i);
  assert.match(migration, /unique \(restaurant_id, recipe_id\)/i);
  assert.match(migration, /public\.recipe_belongs_to_restaurant\(recipe_id, restaurant_id\)/i);
});

test("House Favourite mutation requires membership and validates the recipe Restaurant", () => {
  assert.match(migration, /create or replace function public\.toggle_house_favourite/i);
  assert.match(migration, /if not public\.is_restaurant_member\(target_restaurant_id\)/i);
  assert.match(migration, /if not public\.recipe_belongs_to_restaurant\(target_recipe_id, target_restaurant_id\)/i);
  assert.match(migration, /on conflict \(restaurant_id, recipe_id\)/i);
  assert.match(migration, /delete from public\.house_favourites/i);
});

test("House Favourite RLS exposes records only to members of the owning Restaurant", () => {
  assert.match(migration, /alter table public\.house_favourites enable row level security/i);
  assert.match(migration, /public\.is_restaurant_member\(restaurant_id\)/i);
  assert.match(migration, /grant select, insert, delete on table public\.house_favourites to authenticated/i);
});
