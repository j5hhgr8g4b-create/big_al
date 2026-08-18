import type {
  KitchenDayState,
  KitchenScreenModel,
} from "@/components/kitchen/kitchen-screen";
import type { MenuMealEvent, MenuWeek } from "@/lib/menu/get-menu";

type KitchenRestaurant = {
  id: string;
  name: string;
};

export type BuildKitchenScreenModelInput = {
  activePantryItemCount: number;
  restaurant: KitchenRestaurant | null;
  today: string;
  weeks: readonly MenuWeek[];
};

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"] as const;
const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const KITCHEN_QUOTE: KitchenScreenModel["quote"] = {
  avatarAlt: "Big Al chef illustration",
  avatarSrc: "/stitch/kitchen/big-al-chef.jpg",
  kicker: "BIG AL SAYS",
  spotSrc: "/stitch/kitchen/sausage-fork.jpg",
  text: '"A good sausage makes everything better."',
};

function parseDateOnly(value: string) {
  if (!DATE_ONLY_PATTERN.test(value)) {
    throw new RangeError(`Expected a YYYY-MM-DD date, received "${value}".`);
  }

  const date = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new RangeError(`Expected a valid calendar date, received "${value}".`);
  }

  return date;
}

function toDateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(value: string, days: number) {
  const date = parseDateOnly(value);
  date.setUTCDate(date.getUTCDate() + days);
  return toDateOnly(date);
}

function startOfWeek(value: string) {
  const date = parseDateOnly(value);
  const day = date.getUTCDay();
  const daysSinceMonday = day === 0 ? 6 : day - 1;
  date.setUTCDate(date.getUTCDate() - daysSinceMonday);
  return toDateOnly(date);
}

function isDinner(event: MenuMealEvent) {
  return event.meal_type === "dinner";
}

function findNextDinner(weeks: readonly MenuWeek[], today: string) {
  let nextDinner: MenuMealEvent | null = null;

  for (const event of weeks.slice(0, 2).flatMap((week) => week.events)) {
    if (!isDinner(event) || event.planned_for < today) continue;

    if (!nextDinner || event.planned_for < nextDinner.planned_for) {
      nextDinner = event;
    }
  }

  return nextDinner;
}

function availablePositiveNumber(value: number | null) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : null;
}

function formatDifficulty(value: string | null) {
  const normalized = value?.trim().toLowerCase();
  return normalized ? `${normalized[0].toUpperCase()}${normalized.slice(1)}` : null;
}

function buildRecipeMeta(recipe: MenuMealEvent["recipe"]) {
  const prepMinutes = availablePositiveNumber(recipe.prep_minutes);
  const cookMinutes = availablePositiveNumber(recipe.cook_minutes);
  const totalMinutes = (prepMinutes ?? 0) + (cookMinutes ?? 0);
  const difficulty = formatDifficulty(recipe.difficulty);
  const servings = availablePositiveNumber(recipe.servings);

  return [
    totalMinutes > 0 ? `${totalMinutes} min` : null,
    difficulty,
    servings ? `Serves ${servings}` : null,
  ]
    .filter((value): value is string => value !== null)
    .join(" • ");
}

function buildHero(
  restaurant: KitchenRestaurant | null,
  nextDinner: MenuMealEvent | null,
): KitchenScreenModel["hero"] {
  if (!restaurant) {
    return {
      actionHref: "/restaurants/new",
      actionLabel: "Create Restaurant",
      imageAlt: "",
      imageSrc: null,
      kicker: "NEXT DINNER",
      meta: "",
      title: "Create your Restaurant",
    };
  }

  if (!nextDinner) {
    return {
      actionHref: "/menu",
      actionLabel: "Plan Dinner",
      imageAlt: "",
      imageSrc: null,
      kicker: "NEXT DINNER",
      meta: "",
      title: "No dinner planned",
    };
  }

  return {
    actionHref: `/cookbook/recipes/${encodeURIComponent(nextDinner.recipe.id)}/cook`,
    actionLabel: "Let's Cook",
    imageAlt: nextDinner.recipe.title,
    imageSrc: nextDinner.recipe.image_url,
    kicker: "NEXT DINNER",
    meta: buildRecipeMeta(nextDinner.recipe),
    title: nextDinner.recipe.title,
  };
}

function dayState(date: string, today: string, plannedDates: ReadonlySet<string>): KitchenDayState {
  if (plannedDates.has(date)) return "planned";
  if (date === today) return "today";
  return date < today ? "muted" : "open";
}

function buildWeek(
  restaurant: KitchenRestaurant | null,
  thisWeek: MenuWeek | undefined,
  today: string,
): KitchenScreenModel["week"] {
  const dinnerEvents = restaurant ? (thisWeek?.events ?? []).filter(isDinner) : [];
  const plannedDates = new Set(dinnerEvents.map((event) => event.planned_for));
  const weekStart = restaurant && thisWeek ? thisWeek.start : startOfWeek(today);
  const dinnerCount = dinnerEvents.length;

  return {
    actionHref: "/menu",
    actionLabel: "View Menu",
    days: DAY_LABELS.map((label, index) => {
      const date = addDays(weekStart, index);
      return { label, state: dayState(date, today, plannedDates) };
    }),
    heading: `${dinnerCount} ${dinnerCount === 1 ? "dinner" : "dinners"} planned`,
    kicker: "THIS WEEK",
  };
}

function buildPantry(
  restaurant: KitchenRestaurant | null,
  activePantryItemCount: number,
): KitchenScreenModel["pantry"] {
  const count =
    restaurant && Number.isFinite(activePantryItemCount)
      ? Math.max(0, Math.trunc(activePantryItemCount))
      : 0;

  return {
    heading: `${count} ${count === 1 ? "item" : "items"} on your list`,
    href: "/pantry",
    kicker: "PANTRY",
    showNotification: count > 0,
  };
}

export function buildKitchenScreenModel({
  activePantryItemCount,
  restaurant,
  today,
  weeks,
}: BuildKitchenScreenModelInput): KitchenScreenModel {
  parseDateOnly(today);

  const scopedWeeks = restaurant ? weeks.slice(0, 2) : [];
  const nextDinner = restaurant ? findNextDinner(scopedWeeks, today) : null;

  return {
    hero: buildHero(restaurant, nextDinner),
    pantry: buildPantry(restaurant, activePantryItemCount),
    quote: { ...KITCHEN_QUOTE },
    week: buildWeek(restaurant, scopedWeeks[0], today),
  };
}
