import "server-only";

import { createClient } from "@/lib/supabase/server";

export async function getRecipeBook(recipeBookId: string) {
  const supabase = await createClient();
  const { data: recipeBook } = await supabase
    .from("recipe_books")
    .select("id, restaurant_id, title, description, cover_image_url, created_at")
    .eq("id", recipeBookId)
    .is("archived_at", null)
    .maybeSingle();

  if (!recipeBook) {
    return null;
  }

  const { data: memberships } = await supabase
    .from("recipe_book_recipes")
    .select("recipe_id, created_at")
    .eq("recipe_book_id", recipeBookId)
    .order("created_at", { ascending: false });
  const recipeIds = (memberships ?? []).map((membership) => membership.recipe_id);
  const { data: recipes } = recipeIds.length
    ? await supabase
        .from("recipes")
        .select("id, title, description, image_url, prep_minutes, cook_minutes, servings, difficulty")
        .in("id", recipeIds)
        .is("archived_at", null)
    : { data: [] };
  const { data: favourites } = recipeIds.length
    ? await supabase
        .from("house_favourites")
        .select("recipe_id")
        .eq("restaurant_id", recipeBook.restaurant_id)
        .in("recipe_id", recipeIds)
    : { data: [] };
  const favouriteIds = new Set((favourites ?? []).map((favourite) => favourite.recipe_id));
  const recipesById = new Map(
    (recipes ?? []).map((recipe) => [recipe.id, { ...recipe, house_favourite: favouriteIds.has(recipe.id) }]),
  );

  return {
    ...recipeBook,
    recipes: recipeIds.flatMap((recipeId) => {
      const recipe = recipesById.get(recipeId);
      return recipe ? [recipe] : [];
    }),
  };
}
