import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migrationPath = new URL(
  "../supabase/migrations/20260816103000_m21_beta_starter_recipes.sql",
  import.meta.url,
);

test("Restaurant creation atomically seeds the five attributed beta recipes", async () => {
  const migration = await readFile(migrationPath, "utf8");

  for (const [title, sourceUrl, creatorSource] of [
    ["Fried Sausages", "https://www.bbcgoodfood.com/howto/guide/how-cook-sausages", "Good Food team / Good Food"],
    ["Jerk Chicken", "https://www.bbcgoodfood.com/recipes/jerk-chicken/", "Good Food team / Good Food"],
    ["Creamy Garlic Pasta", "https://www.bbcgoodfood.com/recipes/creamy-garlic-pasta", "Helena Busiakiewicz / Good Food"],
    ["Roast Chicken", "https://www.bbcgoodfood.com/recipes/roast-chicken", "Good Food team / Good Food"],
    ["Scrambled Eggs", "https://www.bbcgoodfood.com/howto/guide/how-make-scrambled-eggs", "Good Food team / Good Food"],
  ]) {
    assert.match(migration, new RegExp(`'${title}'`));
    assert.match(migration, new RegExp(`'${sourceUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}'`));
    assert.match(migration, new RegExp(`'${creatorSource.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}'`));
  }

  assert.match(migration, /perform public\.seed_beta_starter_recipes\(created_restaurant\.id\)/i);
  assert.match(migration, /perform public\.save_recipe\(/i);
  assert.match(migration, /starter -> 'ingredients'/i);
  assert.match(migration, /starter -> 'steps'/i);
  assert.match(migration, /source_url = starter ->> 'source_url'/i);
  assert.match(migration, /inner join public\.cookbooks on cookbooks\.id = recipes\.cookbook_id/i);
  assert.match(migration, /where cookbooks\.restaurant_id = target_restaurant_id/i);
});

test("starter seeding is retry-safe, Restaurant-scoped, and transaction-bound", async () => {
  const [migration, recipeActions] = await Promise.all([
    readFile(migrationPath, "utf8"),
    readFile(new URL("../src/app/(app)/cookbook/recipes/actions.ts", import.meta.url), "utf8"),
  ]);

  assert.match(migration, /if existing_recipe_id is null then/i);
  assert.match(migration, /if not public\.is_restaurant_member\(target_restaurant_id\)/i);
  assert.match(migration, /if not exists \(\s*select 1\s*from public\.cookbooks\s*where restaurant_id = target_restaurant_id/is);
  assert.match(migration, /begin;[\s\S]*perform public\.seed_beta_starter_recipes[\s\S]*commit;/i);
  assert.match(migration, /perform pg_catalog\.pg_advisory_xact_lock/i);
  assert.match(migration, /raise exception 'Restaurant already exists'/i);
  assert.match(recipeActions, /export async function archiveRecipe/i);
  assert.match(recipeActions, /supabase\.rpc\("archive_recipe"/i);
  assert.doesNotMatch(migration, /undeletable|starter_recipe_protected/i);
});
