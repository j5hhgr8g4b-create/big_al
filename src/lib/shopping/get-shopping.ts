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
  isStale: boolean;
  list: ShoppingList | null;
  plannedMealCount: number;
  purchasedItems: ShoppingItem[];
  range: ReturnType<typeof getMenuDateRange>;
};

type RawShoppingItem = Omit<ShoppingItem, "category">;

function normalizeUnicodeFractions(value: string) {
  return value
    .replace(/½/g, "1/2")
    .replace(/¼/g, "1/4")
    .replace(/¾/g, "3/4")
    .replace(/⅓/g, "1/3")
    .replace(/⅔/g, "2/3")
    .replace(/⅛/g, "1/8")
    .replace(/⅜/g, "3/8")
    .replace(/⅝/g, "5/8")
    .replace(/⅞/g, "7/8");
}

function stripPrepNotes(value: string) {
  return normalizeUnicodeFractions(value)
    .replace(/\s+mixed\s+with\s+.*\bwater\b.*\bslurry\b.*$/i, "")
    .replace(/\s+mixed\s+with\s+.*\bcold water\b.*$/i, "")
    .replace(/\s*\([^)]*\)/g, "")
    .replace(
      /\s*,\s*(peeled|finely chopped|roughly chopped|chopped|diced|sliced|minced|grated|crushed|melted|softened|room temperature|optional|to taste|trimmed|washed|drained|rinsed|divided|for serving|to serve|note\s*\d+).*$/i,
      "",
    )
    .replace(/^(peeled|finely chopped|roughly chopped|chopped|diced|sliced|minced|grated|crushed)\s+/i, "")
    .replace(/\s+(optional|to taste|for serving|to serve)$/i, "")
    .replace(/\s+(peeled|finely chopped|roughly chopped|chopped|diced|sliced|minced|grated|crushed|trimmed|washed|drained|rinsed|divided)$/i, "")
    .replace(/\s*,\s*$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parentheticalExample(value: string) {
  return value.match(/\((such as [^)]+)\)/i)?.[1]?.trim() ?? null;
}

function stripLeadingAmount(value: string) {
  return normalizeUnicodeFractions(value)
    .replace(
      /^\s*(\d+\s+\d+\s*\/\s*\d+|\d+\s*\/\s*\d+|\d+(?:\.\d+)?)\s*(tsp|teaspoons?|tbsp|tablespoons?|g|kg|ml|l|oz|lbs?|cups?|pinches?|cloves?|large|medium|small|each)?\s+/i,
      "",
    )
    .trim();
}

function dedupeRepeatedWords(value: string) {
  return value.replace(/\b(\w+)\s+\1\b/gi, "$1").trim();
}

function canonicalGeneratedName(value: string) {
  const stripped = dedupeRepeatedWords(stripLeadingAmount(stripPrepNotes(value)));
  const normalized = stripped.toLowerCase();

  if (normalized === "fresh thyme" || normalized === "thyme") return "Thyme";
  if (normalized === "oil oil" || normalized === "oil") return "Oil";
  if (normalized === "olive oil oil" || normalized === "oil olive oil" || normalized === "olive oil") return "Olive oil";
  if (/^(mashed|roast|boiled) potatoes$/.test(normalized)) return "Potatoes";
  if (/^spring onions?$/.test(normalized)) return "Spring onions";
  if (/^red onions?$/.test(normalized)) return "Red onion";
  if (/^brown onions?$/.test(normalized)) return "Brown onion";

  return stripped;
}

function isGenericSaltOrPepper(value: string) {
  const normalized = canonicalGeneratedName(value)
    .toLowerCase()
    .replace(/[^a-z& ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return /^(salt|pepper|black pepper|ground black pepper|freshly ground black pepper|salt and pepper|salt & pepper|salt and black pepper|salt black pepper|pepper and salt|black pepper and salt|freshly ground black pepper and salt)$/.test(
    normalized,
  );
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
  const example = parentheticalExample(withoutTotal);
  const stripped = canonicalGeneratedName(withoutTotal);
  const distinctGarlic = /(^|\s)(black garlic|garlic powder|garlic granules|garlic paste|garlic oil)(\s|$)/i.test(stripped);
  const garlicLike =
    !distinctGarlic &&
    /^(?:\d+(?:\.\d+)?\s+)?(?:cloves?\s+garlic|garlic\s+cloves?|minced\s+garlic|garlic,?\s+minced|garlic)$/i.test(
      stripped,
    );
  const garlicCloveName = !distinctGarlic && /^garlic cloves?$/i.test(stripped);

  if (!garlicLike && !garlicCloveName) {
    const notes =
      example && item.source === "generated" && !item.notes?.toLowerCase().includes(example.toLowerCase())
        ? [example, item.notes].filter(Boolean).join(" · ")
        : item.notes;

    return {
      ...item,
      name: stripped || item.name,
      notes,
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
    if (item.source === "generated" && isGenericSaltOrPepper(item.name)) {
      continue;
    }

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
    /\b(fresh coriander|fresh parsley|fresh basil|fresh mint|fresh dill|lettuce|rocket|spinach|salad|green vegetables|vegetables|spring onion|red onion|brown onion|onion|garlic|potato|potatoes|sweet potato|carrot|carrots|tomato|lemon|lime|berries|apple|banana|mushroom|courgette|broccoli|cabbage|pepper|peppers|capsicum|asparagus|beans|peas|celery|cucumber|leek|leeks)\b/.test(
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

  if (/\b(flour|cornflour|sugar|rice|pasta|noodles|oil|vinegar|honey|oats|breadcrumbs)\b/.test(normalized)) {
    return "Pantry staples";
  }

  return "Other";
}

export async function getShoppingData(
  supabase: SupabaseClient,
  restaurantId: string,
  today = new Date(),
): Promise<ShoppingData> {
  const range = getMenuDateRange(today);

  const [{ data: list, error: listError }, plannedMealsResult] = await Promise.all([
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

  if (listError) {
    throw new Error("Big Al could not load the Shopping list.", {
      cause: listError,
    });
  }

  if (plannedMealsResult.error) {
    throw new Error("Big Al could not load planned meals for Shopping.", {
      cause: plannedMealsResult.error,
    });
  }

  const { data: items, error: itemsError } = list
    ? await supabase
        .from("shopping_items")
        .select("id, name, quantity, unit, notes, source, is_purchased")
        .eq("shopping_list_id", list.id)
        .order("is_purchased", { ascending: true })
        .order("position", { ascending: true })
        .order("created_at", { ascending: true })
    : { data: [], error: null };

  if (itemsError) {
    throw new Error("Big Al could not load Shopping items.", {
      cause: itemsError,
    });
  }

  const shoppingItems = consolidateGeneratedItems((items ?? []) as RawShoppingItem[]).map((item) => ({
    ...item,
    category: categorizeShoppingItem(item.name),
  }));
  const shoppingList = (list ?? null) as ShoppingList | null;

  return {
    activeItems: shoppingItems.filter((item) => !item.is_purchased),
    isStale: Boolean(
      shoppingList &&
        (shoppingList.source_start_date !== range.thisWeekStart ||
          shoppingList.source_end_date !== range.nextWeekEnd),
    ),
    list: shoppingList,
    plannedMealCount: plannedMealsResult.count ?? 0,
    purchasedItems: shoppingItems.filter((item) => item.is_purchased),
    range,
  };
}
