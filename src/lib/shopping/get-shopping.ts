import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { getMenuDateRange } from "@/lib/menu/get-menu";

export type ShoppingItem = {
  category: ShoppingCategory;
  id: string;
  is_purchased: boolean;
  name: string;
  notes: string | null;
  quantity: number | null;
  source: "generated" | "manual";
  unit: string | null;
};

export type ShoppingCategory =
  | "Fresh produce"
  | "Meat & fish"
  | "Dairy & eggs"
  | "Bakery"
  | "Tins, jars & packets"
  | "Spices & seasonings"
  | "Pantry staples"
  | "Other";

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

type RawShoppingItem = Omit<ShoppingItem, "category">;

function stripPrepNotes(value: string) {
  return value
    .replace(/\s*\([^)]*\)/g, "")
    .replace(
      /\s*,\s*(peeled|finely chopped|chopped|diced|sliced|minced|grated|crushed|melted|softened|room temperature|optional|to taste|note\s*\d+).*$/i,
      "",
    )
    .replace(/^(peeled|finely chopped|chopped|diced|sliced|minced|grated|crushed)\s+/i, "")
    .replace(/\s*,\s*$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseSimpleQuantity(value: string) {
  const match = value.match(/^\s*(\d+(?:\.\d+)?|\d+\s*\/\s*\d+)/);
  if (!match) return null;

  const [quantityText] = match;
  const [numerator, denominator] = quantityText.split("/").map((part) => Number(part.trim()));
  const quantity =
    denominator && Number.isFinite(numerator) && Number.isFinite(denominator)
      ? numerator / denominator
      : Number(quantityText);

  return Number.isFinite(quantity) ? quantity : null;
}

function normaliseGeneratedShoppingItem(item: RawShoppingItem): RawShoppingItem {
  if (item.source !== "generated") return item;

  const withoutTotal = item.name.replace(/\s+total:.*$/i, "");
  const stripped = stripPrepNotes(withoutTotal);
  const distinctGarlic = /(^|\s)(black garlic|garlic powder|garlic granules|garlic paste|garlic oil)(\s|$)/i.test(stripped);
  const garlicLike =
    !distinctGarlic &&
    /^(?:\d+(?:\.\d+)?\s+)?(?:cloves?\s+garlic|garlic\s+cloves?|minced\s+garlic|garlic,?\s+minced|garlic)$/i.test(
      stripped,
    );
  const garlicCloveName = !distinctGarlic && /^garlic cloves?$/i.test(stripped);

  if (!garlicLike && !garlicCloveName) {
    return {
      ...item,
      name: stripped || item.name,
    };
  }

  const parsedQuantity = parseSimpleQuantity(stripped);
  const quantity = parsedQuantity ?? item.quantity;
  const unit =
    parsedQuantity !== null ||
    garlicCloveName ||
    item.unit?.toLowerCase() === "each" ||
    item.unit?.toLowerCase() === "clove" ||
    item.unit?.toLowerCase() === "cloves"
      ? "cloves"
      : item.unit;

  return {
    ...item,
    name: "Garlic",
    notes: item.notes?.replace(/\s*\([^)]*\)/g, "").replace(/\s*,\s*(minced|peeled).*$/i, "") ?? null,
    quantity,
    unit,
  };
}

function buildGroupedNotes(items: RawShoppingItem[]) {
  const usefulNotes = Array.from(
    new Set(
      items
        .map((item) => item.notes)
        .filter((note): note is string => Boolean(note && !/^From \d+ planned meals?$/i.test(note))),
    ),
  );

  if (usefulNotes.length > 0) {
    return usefulNotes.slice(0, 2).join(" · ");
  }

  return `From ${items.length} planned recipe lines`;
}

function consolidateGeneratedItems(items: RawShoppingItem[]): RawShoppingItem[] {
  const groups = new Map<string, RawShoppingItem[]>();

  for (const item of items.map(normaliseGeneratedShoppingItem)) {
    const key =
      item.source === "generated"
        ? `${item.name.toLowerCase()}::${item.unit?.toLowerCase() ?? ""}::${item.is_purchased}`
        : item.id;
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }

  return Array.from(groups.values()).map((group) => {
    if (group.length === 1) return group[0];

    const [first] = group;
    const quantities = group.map((item) => item.quantity);
    const canSum = quantities.every((quantity) => typeof quantity === "number");

    return {
      ...first,
      id: group.map((item) => item.id).join(","),
      notes: buildGroupedNotes(group),
      quantity: canSum ? quantities.reduce((total, quantity) => total + Number(quantity), 0) : null,
    };
  });
}

function categorizeShoppingItem(name: string): ShoppingCategory {
  const normalized = name.toLowerCase();

  if (/\b(chicken|beef|lamb|pork|fish|salmon|cod|haddock|prawn|turkey|bacon|sausage)\b/.test(normalized)) {
    return "Meat & fish";
  }

  if (/\b(milk|cream|cheese|mozzarella|yoghurt|yogurt|butter|ghee|egg|eggs)\b/.test(normalized)) {
    return "Dairy & eggs";
  }

  if (/\b(bread|rolls|baguette|pitta|tortilla|wraps|buns)\b/.test(normalized)) {
    return "Bakery";
  }

  if (
    /\b(tinned|tin|jar|packet|passata|stock|beans|chickpeas|lentils|tomatoes|tomato purée|tomato puree|tomato paste|coconut milk)\b/.test(
      normalized,
    )
  ) {
    return "Tins, jars & packets";
  }

  if (
    /\b(fresh coriander|fresh parsley|fresh basil|fresh mint|fresh dill|lettuce|rocket|spinach|salad|onion|garlic|potato|carrot|tomato|lemon|lime|berries|apple|banana|mushroom|courgette|broccoli|cabbage)\b/.test(
      normalized,
    )
  ) {
    return "Fresh produce";
  }

  if (
    /\b(turmeric|cinnamon|cardamom|cumin|paprika|cayenne|chilli|oregano|thyme|rosemary|mixed herbs|curry powder|garam masala|coriander|garlic powder|onion powder|five spice|nutmeg|cloves|allspice|bay leaves|peppercorns|kosher salt|sea salt)\b/.test(
      normalized,
    )
  ) {
    return "Spices & seasonings";
  }

  if (/\b(flour|sugar|rice|pasta|noodles|oil|vinegar|honey|oats|breadcrumbs)\b/.test(normalized)) {
    return "Pantry staples";
  }

  return "Other";
}

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

  const shoppingItems = consolidateGeneratedItems((items ?? []) as RawShoppingItem[]).map((item) => ({
    ...item,
    category: categorizeShoppingItem(item.name),
  }));

  return {
    activeItems: shoppingItems.filter((item) => !item.is_purchased),
    list: (list ?? null) as ShoppingList | null,
    plannedMealCount: plannedMealsResult.count ?? 0,
    purchasedItems: shoppingItems.filter((item) => item.is_purchased),
    range,
  };
}
