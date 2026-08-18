import assert from "node:assert/strict";
import test from "node:test";

import { buildKitchenScreenModel } from "../src/lib/kitchen/build-kitchen-screen-model.ts";
import {
  getMenuPlanningData,
  getMenuTodayValue,
} from "../src/lib/menu/get-menu.ts";

function recipe(id, overrides = {}) {
  return {
    cook_minutes: null,
    description: null,
    difficulty: null,
    id,
    image_url: null,
    prep_minutes: null,
    servings: null,
    title: `Recipe ${id}`,
    ...overrides,
  };
}

function meal(id, plannedFor, mealType, recipeOverrides = {}) {
  return {
    id,
    meal_type: mealType,
    notes: null,
    people_eating: null,
    planned_for: plannedFor,
    recipe: recipe(`recipe-${id}`, recipeOverrides),
    recipe_id: `recipe-${id}`,
    servings_estimate: null,
  };
}

function week(start, end, events = []) {
  return { end, events, label: "Test week", start };
}

const restaurant = { id: "restaurant-1", name: "Wallaces" };
const emptyWeeks = [
  week("2026-08-17", "2026-08-23"),
  week("2026-08-24", "2026-08-30"),
];

function build(overrides = {}) {
  return buildKitchenScreenModel({
    activePantryItemCount: 0,
    restaurant,
    today: "2026-08-19",
    weeks: emptyWeeks,
    ...overrides,
  });
}

test("normalizes one shared local calendar date for Menu, Pantry, and Kitchen", () => {
  assert.equal(getMenuTodayValue(new Date(2026, 7, 19, 23, 59, 59)), "2026-08-19");
});

test("does not turn a failed Menu read into an empty planning state", async () => {
  const failedCookbookQuery = {
    eq() {
      return this;
    },
    maybeSingle() {
      return Promise.resolve({ data: null, error: new Error("database unavailable") });
    },
    select() {
      return this;
    },
  };
  const supabase = {
    from() {
      return failedCookbookQuery;
    },
  };

  await assert.rejects(
    () => getMenuPlanningData(supabase, "restaurant-1", new Date(2026, 7, 19)),
    /could not load the Restaurant Cookbook/,
  );
});

test("selects the earliest dinner on or after today across this week and next week", () => {
  const model = build({
    weeks: [
      week("2026-08-17", "2026-08-23", [
        meal("past", "2026-08-18", "dinner", { title: "Past Dinner" }),
        meal("lunch", "2026-08-19", "lunch", { title: "Today's Lunch" }),
        meal("sunday", "2026-08-23", "dinner", {
          cook_minutes: 20,
          difficulty: "easy",
          image_url: "https://example.com/sunday.jpg",
          prep_minutes: 10,
          servings: 4,
          title: "Sunday Dinner",
        }),
      ]),
      week("2026-08-24", "2026-08-30", [
        meal("monday", "2026-08-24", "dinner", { title: "Next Week Dinner" }),
      ]),
    ],
  });

  assert.deepEqual(model.hero, {
    actionHref: "/cookbook/recipes/recipe-sunday/cook",
    actionLabel: "Let's Cook",
    imageAlt: "Sunday Dinner",
    imageSrc: "https://example.com/sunday.jpg",
    kicker: "NEXT DINNER",
    meta: "30 min • Easy • Serves 4",
    title: "Sunday Dinner",
  });
});

test("builds dinner metadata only from the fields that are available", () => {
  const partial = build({
    weeks: [
      week("2026-08-17", "2026-08-23", [
        meal("partial", "2026-08-20", "dinner", {
          cook_minutes: 25,
          title: "Partial Recipe",
        }),
      ]),
      emptyWeeks[1],
    ],
  });
  const absent = build({
    weeks: [
      week("2026-08-17", "2026-08-23", [
        meal("absent", "2026-08-20", "dinner", { title: "Bare Recipe" }),
      ]),
      emptyWeeks[1],
    ],
  });

  assert.equal(partial.hero.meta, "25 min");
  assert.equal(absent.hero.meta, "");
});

test("returns a complete truthful model without a Restaurant and ignores scoped-looking inputs", () => {
  const model = build({
    activePantryItemCount: 7,
    restaurant: null,
    weeks: [
      week("2026-08-17", "2026-08-23", [
        meal("foreign", "2026-08-20", "dinner", { title: "Must Not Leak" }),
      ]),
      emptyWeeks[1],
    ],
  });

  assert.deepEqual(model.hero, {
    actionHref: "/restaurants/new",
    actionLabel: "Create Restaurant",
    imageAlt: "",
    imageSrc: null,
    kicker: "NEXT DINNER",
    meta: "",
    title: "Create your Restaurant",
  });
  assert.equal(model.week.heading, "0 dinners planned");
  assert.equal(model.week.days.length, 7);
  assert.deepEqual(model.pantry, {
    heading: "0 items on your list",
    href: "/pantry",
    kicker: "PANTRY",
    showNotification: false,
  });
  assert.deepEqual(Object.keys(model).sort(), ["hero", "pantry", "quote", "week"]);
});

test("returns a truthful no-dinner state when no future dinner is available", () => {
  const model = build({
    weeks: [
      week("2026-08-17", "2026-08-23", [
        meal("past", "2026-08-18", "dinner"),
        meal("future-lunch", "2026-08-20", "lunch"),
      ]),
      emptyWeeks[1],
    ],
  });

  assert.equal(model.hero.title, "No dinner planned");
  assert.equal(model.hero.meta, "");
  assert.equal(model.hero.actionHref, "/menu");
  assert.equal(model.hero.actionLabel, "Plan Dinner");
  assert.equal(model.week.days[2].state, "today");
});

test("counts this-week dinners while using distinct dinner dates for the day dots", () => {
  const model = build({
    weeks: [
      week("2026-08-17", "2026-08-23", [
        meal("monday-one", "2026-08-17", "dinner"),
        meal("monday-two", "2026-08-17", "dinner"),
        meal("today", "2026-08-19", "dinner"),
        meal("friday-lunch", "2026-08-21", "lunch"),
      ]),
      emptyWeeks[1],
    ],
  });

  assert.equal(model.week.heading, "3 dinners planned");
  assert.deepEqual(model.week.days, [
    { label: "M", state: "planned" },
    { label: "T", state: "muted" },
    { label: "W", state: "planned" },
    { label: "T", state: "open" },
    { label: "F", state: "open" },
    { label: "S", state: "open" },
    { label: "S", state: "open" },
  ]);

  const singular = build({
    weeks: [
      week("2026-08-17", "2026-08-23", [meal("one", "2026-08-20", "dinner")]),
      emptyWeeks[1],
    ],
  });
  assert.equal(singular.week.heading, "1 dinner planned");
});

test("pluralizes the active Pantry count and only shows a notification for open items", () => {
  const empty = build({ activePantryItemCount: 0 });
  const singular = build({ activePantryItemCount: 1 });
  const plural = build({ activePantryItemCount: 12 });

  assert.equal(empty.pantry.heading, "0 items on your list");
  assert.equal(empty.pantry.showNotification, false);
  assert.equal(singular.pantry.heading, "1 item on your list");
  assert.equal(singular.pantry.showNotification, true);
  assert.equal(plural.pantry.heading, "12 items on your list");
  assert.equal(plural.pantry.showNotification, true);
});
