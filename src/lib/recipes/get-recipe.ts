import "server-only";

import { createClient } from "@/lib/supabase/server";

export type RecipeIngredient = {
  id: string;
  name: string;
  position: number;
  preparation: string | null;
  quantity: number | null;
  unit: string | null;
};

export type RecipeStep = {
  id: string;
  instruction: string;
  position: number;
};

export type RecipeDetail = {
  archived_at: string | null;
  cook_minutes: number | null;
  cookbook_id: string;
  created_at: string;
  creatorName: string;
  description: string | null;
  difficulty: "easy" | "medium" | "hard" | null;
  id: string;
  image_url: string | null;
  ingredients: RecipeIngredient[];
  prep_minutes: number | null;
  restaurantId: string;
  servings: number | null;
  source_url: string | null;
  steps: RecipeStep[];
  title: string;
  updated_at: string;
};

export async function getRecipeDetail(recipeId: string): Promise<RecipeDetail | null> {
  const supabase = await createClient();
  const { data: recipe } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", recipeId)
    .is("archived_at", null)
    .maybeSingle();

  if (!recipe) {
    return null;
  }

  const [cookbookResult, chefResult, ingredientRowsResult, stepsResult] = await Promise.all([
    supabase.from("cookbooks").select("restaurant_id").eq("id", recipe.cookbook_id).single(),
    supabase.from("chefs").select("display_name").eq("id", recipe.creator_chef_id).single(),
    supabase
      .from("recipe_ingredients")
      .select("id, ingredient_id, position, quantity, unit, preparation")
      .eq("recipe_id", recipeId)
      .order("position"),
    supabase
      .from("recipe_steps")
      .select("id, position, instruction")
      .eq("recipe_id", recipeId)
      .order("position"),
  ]);

  if (!cookbookResult.data) {
    return null;
  }

  const ingredientRows = ingredientRowsResult.data ?? [];
  const ingredientIds = ingredientRows.map((item) => item.ingredient_id);
  const { data: ingredientNames } = ingredientIds.length
    ? await supabase.from("ingredients").select("id, name").in("id", ingredientIds)
    : { data: [] };
  const namesById = new Map((ingredientNames ?? []).map((item) => [item.id, item.name]));

  return {
    ...recipe,
    creatorName: chefResult.data?.display_name ?? "Chef",
    ingredients: ingredientRows.map((item) => ({
      id: item.id,
      name: namesById.get(item.ingredient_id) ?? "Ingredient",
      position: item.position,
      preparation: item.preparation,
      quantity: item.quantity,
      unit: item.unit,
    })),
    restaurantId: cookbookResult.data.restaurant_id,
    steps: stepsResult.data ?? [],
  } as RecipeDetail;
}
