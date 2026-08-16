import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Restaurant creation serializes retries and rejects existing memberships", async () => {
  const migration = await readFile(
    new URL(
      "../supabase/migrations/20260816090500_m21_restaurant_creation_retry_guard.sql",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(migration, /current_profile_id uuid := auth.uid()/i);
  assert.match(migration, /pg_advisory_xact_lock/i);
  assert.match(migration, /hashtextextended\(current_profile_id::text, 0\)/i);
  assert.match(migration, /from public\.restaurant_members\s+where profile_id = current_profile_id/i);
  assert.match(migration, /raise exception 'Restaurant already exists'/i);
  assert.match(migration, /insert into public.restaurants/i);
  assert.match(migration, /insert into public.restaurant_members/i);
});
