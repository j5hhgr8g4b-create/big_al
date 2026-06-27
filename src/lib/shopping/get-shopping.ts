import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { getMenuDateRange } from "@/lib/menu/get-menu";

export type ShoppingItem = {
  id: string;
  is_purchased: boolean;
  name: string;
  notes: string | null;
  quantity: number | null;
  source: "generated" | "manual";
  unit: string | null;
};

export type ShoppingList = {
  generated_at: string | null;
  id: string;
  source_end_date: string | null;
  source_start_date: string | null;
  title: string;
};

export type ShoppingData = {
  activeItems: ShoppingItem[];
  list: ShoppingList | null;
  plannedMealCount: number;
  purchasedItems: ShoppingItem[];
  range: ReturnType<typeof getMenuDateRange>;
};

export async function getShoppingData(
  supabase: SupabaseClient,
  restaurantId: string,
): Promise<ShoppingData> {
  const range = getMenuDateRange();

  const [{ data: list }, plannedMealsResult] = await Promise.all([
    supabase
      .from("shopping_lists")
      .select("id, title, source_start_date, source_end_date, generated_at")
      .eq("restaurant_id", restaurantId)
      .is("archived_at", null)
      .maybeSingle(),
    supabase
      .from("meal_events")
      .select("id", { count: "exact", head: true })
      .eq("restaurant_id", restaurantId)
      .is("archived_at", null)
      .gte("planned_for", range.thisWeekStart)
      .lte("planned_for", range.nextWeekEnd),
  ]);

  const { data: items } = list
    ? await supabase
        .from("shopping_items")
        .select("id, name, quantity, unit, notes, source, is_purchased")
        .eq("shopping_list_id", list.id)
        .order("is_purchased", { ascending: true })
        .order("position", { ascending: true })
        .order("created_at", { ascending: true })
    : { data: [] };

  const shoppingItems = (items ?? []) as ShoppingItem[];

  return {
    activeItems: shoppingItems.filter((item) => !item.is_purchased),
    list: (list ?? null) as ShoppingList | null,
    plannedMealCount: plannedMealsResult.count ?? 0,
    purchasedItems: shoppingItems.filter((item) => item.is_purchased),
    range,
  };
}
