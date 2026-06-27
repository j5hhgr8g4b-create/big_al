import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { formatMenuDate, getMenuDateRange } from "@/lib/menu/get-menu";

export type BigAlMode = "cook-again" | "find" | "planned" | "recent" | "saved" | "suggest";

type RecipeRow = {
  cook_minutes: number | null;
  created_at: string;
  description: string | null;
  difficulty: string | null;
  id: string;
  prep_minutes: number | null;
  servings: number | null;
  title: string;
};

type IngredientLinkRow = {
  ingredient_id: string;
  preparation: string | null;
  quantity: number | null;
  recipe_id: string;
  unit: string | null;
};

type IngredientRow = {
  id: string;
  name: string;
};

type RecipeStepRow = {
  instruction: string;
  recipe_id: string;
};

type MealEventRow = {
  meal_type: string | null;
  planned_for: string;
  recipe_id: string;
};

type RecipeCookRow = {
  cook_again: boolean | null;
  cooked_at: string;
  recipe_id: string;
};

type ShoppingItemRow = {
  is_purchased: boolean;
  name: string;
};

export type BigAlRecipe = RecipeRow & {
  cookAgainCount: number;
  cookedCount: number;
  ingredients: string[];
  lastCookedAt: string | null;
  plannedDates: string[];
  steps: string[];
};

export type BigAlAnswer = {
  emptyLabel?: string;
  mode: BigAlMode;
  recipes: BigAlRecipe[];
  summary: string;
  title: string;
};

export type BigAlData = {
  answer: BigAlAnswer;
  mode: BigAlMode;
  query: string;
  recipeCount: number;
  shoppingTodoCount: number;
};

export function normalizeBigAlMode(value: string | undefined): BigAlMode {
  if (
    value === "cook-again" ||
    value === "find" ||
    value === "planned" ||
    value === "recent" ||
    value === "saved" ||
    value === "suggest"
  ) {
    return value;
  }

  return "suggest";
}

function includesNeedle(value: string | null | undefined, needle: string) {
  return value?.toLowerCase().includes(needle) ?? false;
}

function uniqueByRecipeId(recipes: BigAlRecipe[]) {
  const seen = new Set<string>();
  return recipes.filter((recipe) => {
    if (seen.has(recipe.id)) return false;
    seen.add(recipe.id);
    return true;
  });
}

function recipeTime(recipe: Pick<BigAlRecipe, "cook_minutes" | "prep_minutes">) {
  return (recipe.prep_minutes ?? 0) + (recipe.cook_minutes ?? 0);
}

function answerForMode(mode: BigAlMode, query: string, recipes: BigAlRecipe[]): BigAlAnswer {
  if (!recipes.length) {
    return {
      emptyLabel: "Import a Recipe first and I will have something useful to work with.",
      mode,
      recipes: [],
      summary: "I do not have enough Restaurant data yet. No bluffing from me.",
      title: "Big Al needs a Cookbook",
    };
  }

  if (mode === "saved") {
    return {
      mode,
      recipes: recipes.slice(0, 8),
      summary: `I found ${recipes.length} saved Recipe${recipes.length === 1 ? "" : "s"} in this Restaurant.`,
      title: "Saved Recipes",
    };
  }

  if (mode === "planned") {
    const planned = recipes.filter((recipe) => recipe.plannedDates.length > 0);
    return planned.length
      ? {
          mode,
          recipes: planned.slice(0, 8),
          summary: "These are already on the Menu. Future-you has made at least one decent decision.",
          title: "Planned this week",
        }
      : {
          emptyLabel: "Plan meals in Menu and I can surface them here.",
          mode,
          recipes: [],
          summary: "Nothing is planned for the current Menu window.",
          title: "No planned Recipes yet",
        };
  }

  if (mode === "recent") {
    const cooked = recipes
      .filter((recipe) => recipe.lastCookedAt)
      .sort((a, b) => String(b.lastCookedAt).localeCompare(String(a.lastCookedAt)));

    return cooked.length
      ? {
          mode,
          recipes: cooked.slice(0, 8),
          summary: "Recently cooked Recipes from this Restaurant, newest first.",
          title: "Recently cooked",
        }
      : {
          emptyLabel: "Cook a Recipe in Cook Mode and mark it cooked. I will remember it here.",
          mode,
          recipes: [],
          summary: "No cooked Recipe history yet.",
          title: "Nothing cooked yet",
        };
  }

  if (mode === "cook-again") {
    const again = recipes
      .filter((recipe) => recipe.cookAgainCount > 0)
      .sort((a, b) => b.cookAgainCount - a.cookAgainCount || b.cookedCount - a.cookedCount);

    return again.length
      ? {
          mode,
          recipes: again.slice(0, 8),
          summary: "These have at least one cook-again vote. Quietly useful signal.",
          title: "Worth cooking again",
        }
      : {
          emptyLabel: "Mark Recipes cooked and choose Cook again. Then I can spot the keepers.",
          mode,
          recipes: [],
          summary: "No cook-again feedback yet.",
          title: "No repeat winners yet",
        };
  }

  if (mode === "find") {
    const needle = query.toLowerCase();
    const matches = query
      ? recipes.filter(
          (recipe) =>
            includesNeedle(recipe.title, needle) ||
            includesNeedle(recipe.description, needle) ||
            recipe.ingredients.some((ingredient) => ingredient.toLowerCase().includes(needle)) ||
            recipe.steps.some((step) => step.toLowerCase().includes(needle)),
        )
      : [];

    return matches.length
      ? {
          mode,
          recipes: matches.slice(0, 8),
          summary: `I searched titles, descriptions, Ingredients and steps for "${query}".`,
          title: `Found "${query}"`,
        }
      : {
          emptyLabel: query
            ? "Try a Recipe title or Ingredient you know is saved."
            : "Search for something like chicken, rice, pasta or a Recipe title.",
          mode,
          recipes: [],
          summary: query ? `I could not find "${query}" in stored Recipe data.` : "Tell me what to look for.",
          title: query ? "No match in the Cookbook" : "Find saved Recipes",
        };
  }

  const suggested = uniqueByRecipeId([
    ...recipes
      .filter((recipe) => recipe.plannedDates.length > 0)
      .sort((a, b) => b.plannedDates.length - a.plannedDates.length),
    ...recipes
      .filter((recipe) => recipe.cookAgainCount > 0)
      .sort((a, b) => b.cookAgainCount - a.cookAgainCount),
    ...recipes
      .filter((recipe) => recipe.cookedCount > 0)
      .sort((a, b) => b.cookedCount - a.cookedCount),
    ...recipes
      .slice()
      .sort((a, b) => recipeTime(a) - recipeTime(b)),
  ]).slice(0, 5);

  return {
    mode,
    recipes: suggested,
    summary: "I picked from saved Recipes using simple signals: planned, cooked, cook-again, then quick wins.",
    title: "Something to cook",
  };
}

export function recipeReason(recipe: BigAlRecipe) {
  if (recipe.plannedDates.length > 0) return `Planned for ${recipe.plannedDates.map(formatMenuDate).join(", ")}.`;
  if (recipe.cookAgainCount > 0) return `${recipe.cookAgainCount} cook-again vote${recipe.cookAgainCount === 1 ? "" : "s"}.`;
  if (recipe.cookedCount > 0) return `Cooked ${recipe.cookedCount} time${recipe.cookedCount === 1 ? "" : "s"}.`;

  const time = recipeTime(recipe);
  if (time > 0) return `${time} minutes total. Not instant, but not a saga.`;
  return "Saved in this Restaurant's Cookbook.";
}

export async function getBigAlData(
  supabase: SupabaseClient,
  restaurantId: string,
  mode: BigAlMode,
  query: string,
): Promise<BigAlData> {
  const range = getMenuDateRange();
  const { data: cookbook } = await supabase
    .from("cookbooks")
    .select("id")
    .eq("restaurant_id", restaurantId)
    .maybeSingle();

  const [
    recipesResult,
    mealEventsResult,
    recipeCooksResult,
    shoppingListsResult,
  ] = await Promise.all([
    cookbook
      ? supabase
          .from("recipes")
          .select("id, title, description, prep_minutes, cook_minutes, servings, difficulty, created_at")
          .eq("cookbook_id", cookbook.id)
          .is("archived_at", null)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] }),
    supabase
      .from("meal_events")
      .select("recipe_id, planned_for, meal_type")
      .eq("restaurant_id", restaurantId)
      .is("archived_at", null)
      .gte("planned_for", range.thisWeekStart)
      .lte("planned_for", range.nextWeekEnd)
      .order("planned_for", { ascending: true }),
    supabase
      .from("recipe_cooks")
      .select("recipe_id, cooked_at, cook_again")
      .eq("restaurant_id", restaurantId)
      .order("cooked_at", { ascending: false }),
    supabase
      .from("shopping_lists")
      .select("id")
      .eq("restaurant_id", restaurantId)
      .is("archived_at", null)
      .maybeSingle(),
  ]);

  const recipes = (recipesResult.data ?? []) as RecipeRow[];
  const recipeIds = recipes.map((recipe) => recipe.id);

  const [ingredientLinksResult, stepsResult, shoppingItemsResult] = await Promise.all([
    recipeIds.length
      ? supabase
          .from("recipe_ingredients")
          .select("recipe_id, ingredient_id, quantity, unit, preparation")
          .in("recipe_id", recipeIds)
      : Promise.resolve({ data: [] }),
    recipeIds.length
      ? supabase
          .from("recipe_steps")
          .select("recipe_id, instruction")
          .in("recipe_id", recipeIds)
      : Promise.resolve({ data: [] }),
    shoppingListsResult.data
      ? supabase
          .from("shopping_items")
          .select("name, is_purchased")
          .eq("shopping_list_id", shoppingListsResult.data.id)
      : Promise.resolve({ data: [] }),
  ]);

  const ingredientLinks = (ingredientLinksResult.data ?? []) as IngredientLinkRow[];
  const ingredientIds = Array.from(new Set(ingredientLinks.map((ingredient) => ingredient.ingredient_id)));
  const { data: ingredientNames } = ingredientIds.length
    ? await supabase.from("ingredients").select("id, name").in("id", ingredientIds)
    : { data: [] };
  const namesById = new Map(((ingredientNames ?? []) as IngredientRow[]).map((item) => [item.id, item.name]));

  const ingredientsByRecipe = new Map<string, string[]>();
  for (const link of ingredientLinks) {
    const name = namesById.get(link.ingredient_id);
    if (!name) continue;
    const current = ingredientsByRecipe.get(link.recipe_id) ?? [];
    current.push(name);
    ingredientsByRecipe.set(link.recipe_id, current);
  }

  const stepsByRecipe = new Map<string, string[]>();
  for (const step of (stepsResult.data ?? []) as RecipeStepRow[]) {
    const current = stepsByRecipe.get(step.recipe_id) ?? [];
    current.push(step.instruction);
    stepsByRecipe.set(step.recipe_id, current);
  }

  const plannedByRecipe = new Map<string, string[]>();
  for (const event of (mealEventsResult.data ?? []) as MealEventRow[]) {
    const current = plannedByRecipe.get(event.recipe_id) ?? [];
    current.push(event.planned_for);
    plannedByRecipe.set(event.recipe_id, current);
  }

  const cookedByRecipe = new Map<string, RecipeCookRow[]>();
  for (const cook of (recipeCooksResult.data ?? []) as RecipeCookRow[]) {
    const current = cookedByRecipe.get(cook.recipe_id) ?? [];
    current.push(cook);
    cookedByRecipe.set(cook.recipe_id, current);
  }

  const enrichedRecipes = recipes.map((recipe) => {
    const cooks = cookedByRecipe.get(recipe.id) ?? [];

    return {
      ...recipe,
      cookAgainCount: cooks.filter((cook) => cook.cook_again === true).length,
      cookedCount: cooks.length,
      ingredients: ingredientsByRecipe.get(recipe.id) ?? [],
      lastCookedAt: cooks[0]?.cooked_at ?? null,
      plannedDates: plannedByRecipe.get(recipe.id) ?? [],
      steps: stepsByRecipe.get(recipe.id) ?? [],
    };
  });

  return {
    answer: answerForMode(mode, query, enrichedRecipes),
    mode,
    query,
    recipeCount: recipes.length,
    shoppingTodoCount: ((shoppingItemsResult.data ?? []) as ShoppingItemRow[]).filter(
      (item) => !item.is_purchased,
    ).length,
  };
}
