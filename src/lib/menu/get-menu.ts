import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

type MenuRecipeRow = {
  cook_minutes: number | null;
  description: string | null;
  difficulty: string | null;
  id: string;
  image_url: string | null;
  prep_minutes: number | null;
  servings: number | null;
  title: string;
};

type MealEventRow = {
  id: string;
  meal_type: string | null;
  notes: string | null;
  people_eating: number | null;
  planned_for: string;
  recipe_id: string;
  servings_estimate: number | null;
};

export type MenuMealEvent = MealEventRow & {
  recipe: MenuRecipeRow;
};

export type MenuPlanningRecipe = MenuRecipeRow;

export type MenuWeek = {
  end: string;
  events: MenuMealEvent[];
  label: string;
  start: string;
};

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function getMenuTodayValue(today = new Date()) {
  return toDateInputValue(
    new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())),
  );
}

function startOfWeek(date: Date) {
  const copy = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = copy.getUTCDay();
  const daysSinceMonday = day === 0 ? 6 : day - 1;
  copy.setUTCDate(copy.getUTCDate() - daysSinceMonday);
  return copy;
}

function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
}

export function getMenuDateRange(today = new Date()) {
  const thisWeekStart = startOfWeek(today);
  const nextWeekStart = addDays(thisWeekStart, 7);

  return {
    nextWeekEnd: toDateInputValue(addDays(nextWeekStart, 6)),
    nextWeekStart: toDateInputValue(nextWeekStart),
    thisWeekEnd: toDateInputValue(addDays(thisWeekStart, 6)),
    thisWeekStart: toDateInputValue(thisWeekStart),
  };
}

export function formatMenuDate(dateValue: string) {
  const date = new Date(`${dateValue}T00:00:00Z`);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    weekday: "short",
  }).format(date);
}

export function servingsContext(event: Pick<MenuMealEvent, "people_eating" | "servings_estimate">) {
  if (!event.people_eating) return "People eating not set";
  if (!event.servings_estimate) return `${event.people_eating} eating. Recipe servings not set.`;

  const servings = Number(event.servings_estimate);
  const people = Number(event.people_eating);

  if (servings === people) return `Serves ${servings}. Right on for ${people}.`;
  if (servings > people) return `Serves ${servings}. A little extra for ${people}.`;
  return `Serves ${servings}. Scale up for ${people}.`;
}

export async function getMenuPlanningData(
  supabase: SupabaseClient,
  restaurantId: string,
  today = new Date(),
): Promise<{
  planningRecipes: MenuPlanningRecipe[];
  unplannedRecipes: MenuPlanningRecipe[];
  weeks: [MenuWeek, MenuWeek];
}> {
  const range = getMenuDateRange(today);
  const { data: cookbook, error: cookbookError } = await supabase
    .from("cookbooks")
    .select("id")
    .eq("restaurant_id", restaurantId)
    .maybeSingle();

  if (cookbookError) {
    throw new Error("Big Al could not load the Restaurant Cookbook.", {
      cause: cookbookError,
    });
  }

  const [recipesResult, eventsResult] = await Promise.all([
    cookbook
      ? supabase
          .from("recipes")
          .select("id, title, description, image_url, prep_minutes, cook_minutes, servings, difficulty")
          .eq("cookbook_id", cookbook.id)
          .is("archived_at", null)
          .order("title")
      : Promise.resolve({ data: [] as MenuPlanningRecipe[], error: null }),
    supabase
      .from("meal_events")
      .select("id, recipe_id, planned_for, meal_type, people_eating, servings_estimate, notes")
      .eq("restaurant_id", restaurantId)
      .is("archived_at", null)
      .gte("planned_for", range.thisWeekStart)
      .lte("planned_for", range.nextWeekEnd)
      .order("planned_for", { ascending: true })
      .order("created_at", { ascending: true }),
  ]);

  if (recipesResult.error) {
    throw new Error("Big Al could not load Recipes for the Menu.", {
      cause: recipesResult.error,
    });
  }

  if (eventsResult.error) {
    throw new Error("Big Al could not load planned meals.", {
      cause: eventsResult.error,
    });
  }

  const planningRecipes = (recipesResult.data ?? []) as MenuPlanningRecipe[];
  const recipesById = new Map(planningRecipes.map((recipe) => [recipe.id, recipe]));
  const events = ((eventsResult.data ?? []) as MealEventRow[])
    .map((event) => {
      const recipe = recipesById.get(event.recipe_id);
      return recipe ? { ...event, recipe } : null;
    })
    .filter((event): event is MenuMealEvent => event !== null);
  const plannedRecipeIds = new Set(events.map((event) => event.recipe_id));

  return {
    planningRecipes,
    unplannedRecipes: planningRecipes.filter((recipe) => !plannedRecipeIds.has(recipe.id)).slice(0, 6),
    weeks: [
      {
        end: range.thisWeekEnd,
        events: events.filter((event) => event.planned_for <= range.thisWeekEnd),
        label: "This Week",
        start: range.thisWeekStart,
      },
      {
        end: range.nextWeekEnd,
        events: events.filter((event) => event.planned_for >= range.nextWeekStart),
        label: "Next Week",
        start: range.nextWeekStart,
      },
    ],
  };
}
