import Link from "next/link";

import { SectionIntro } from "@/components/section-intro";
import { SubmitButton } from "@/components/submit-button";
import {
  formatMenuDate,
  getMenuDateRange,
  getMenuPlanningData,
  servingsContext,
  type MenuMealEvent,
  type MenuPlanningRecipe,
} from "@/lib/menu/get-menu";
import { getCurrentRestaurant } from "@/lib/restaurants/current";

import { archiveMealEvent, saveMealEvent } from "./actions";

type MenuPageProps = {
  searchParams: Promise<{ error?: string }>;
};

const mealTypes = ["breakfast", "lunch", "dinner", "snack", "other"];

function MealEventCard({ event }: { event: MenuMealEvent }) {
  return (
    <article className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
            {formatMenuDate(event.planned_for)}
            {event.meal_type ? ` · ${event.meal_type}` : ""}
          </p>
          <Link
            href={`/cookbook/recipes/${event.recipe.id}`}
            className="mt-2 block text-xl font-semibold tracking-tight"
          >
            {event.recipe.title}
          </Link>
        </div>
        <form action={archiveMealEvent}>
          <input type="hidden" name="mealEventId" value={event.id} />
          <button
            type="submit"
            className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--muted)]"
          >
            Remove
          </button>
        </form>
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{servingsContext(event)}</p>
      {event.notes && <p className="mt-3 text-sm leading-6">{event.notes}</p>}
    </article>
  );
}

function AddMealForm({
  defaultDate,
  recipes,
  restaurantId,
}: {
  defaultDate: string;
  recipes: MenuPlanningRecipe[];
  restaurantId: string;
}) {
  return (
    <form action={saveMealEvent} className="mt-8 rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm">
      <input type="hidden" name="restaurantId" value={restaurantId} />
      <input type="hidden" name="returnPath" value="/menu" />
      <h2 className="text-xl font-semibold tracking-tight">Add Recipe to Menu</h2>
      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="text-sm font-semibold">Recipe</span>
          <select
            name="recipeId"
            required
            className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-orange-100"
          >
            <option value="">Choose a Recipe</option>
            {recipes.map((recipe) => (
              <option key={recipe.id} value={recipe.id}>
                {recipe.title}
                {recipe.servings ? ` · serves ${recipe.servings}` : ""}
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm font-semibold">Date</span>
            <input
              name="plannedFor"
              type="date"
              required
              defaultValue={defaultDate}
              className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-orange-100"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">People eating</span>
            <input
              name="peopleEating"
              type="number"
              min={1}
              max={100}
              required
              defaultValue={2}
              className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-orange-100"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-semibold">Meal</span>
          <select
            name="mealType"
            defaultValue="dinner"
            className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm capitalize outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-orange-100"
          >
            {mealTypes.map((mealType) => (
              <option key={mealType} value={mealType}>
                {mealType}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-semibold">Note</span>
          <textarea
            name="notes"
            rows={3}
            maxLength={1000}
            placeholder="Optional, like 'double the rice'"
            className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-orange-100"
          />
        </label>
      </div>
      <div className="mt-5">
        <SubmitButton pendingLabel="Adding...">Add to Menu</SubmitButton>
      </div>
    </form>
  );
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const { error } = await searchParams;
  const { restaurant, supabase } = await getCurrentRestaurant();
  const range = getMenuDateRange();

  if (!restaurant) {
    return (
      <>
        <SectionIntro
          eyebrow="Plan ahead"
          title="Menu"
          description="Create your Restaurant before planning meals."
        />
        <Link
          href="/restaurants/new"
          className="mt-8 inline-flex rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white"
        >
          Create Restaurant
        </Link>
      </>
    );
  }

  const { planningRecipes, unplannedRecipes, weeks } = await getMenuPlanningData(
    supabase,
    restaurant.id,
  );

  return (
    <>
      <SectionIntro
        eyebrow={restaurant.name}
        title="Menu"
        description="Plan this week, line up next week, and keep good ideas close by."
      />

      {error && (
        <p className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}

      {planningRecipes.length ? (
        <AddMealForm
          defaultDate={range.thisWeekStart}
          recipes={planningRecipes}
          restaurantId={restaurant.id}
        />
      ) : (
        <section className="mt-8 rounded-3xl border border-dashed border-[var(--border)] p-8 text-center">
          <h2 className="text-xl font-semibold">No Recipes to plan yet</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Add a Recipe to your Cookbook, then it can come over here for dinner duty.
          </p>
          <Link
            href="/cookbook/imports/new"
            className="mt-4 inline-block text-sm font-semibold text-[var(--accent)]"
          >
            Import Recipe
          </Link>
        </section>
      )}

      <div className="mt-10 space-y-10">
        {weeks.map((week) => (
          <section key={week.label} aria-labelledby={`${week.label.toLowerCase().replace(" ", "-")}-heading`}>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 id={`${week.label.toLowerCase().replace(" ", "-")}-heading`} className="text-2xl font-semibold tracking-tight">
                  {week.label}
                </h2>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {formatMenuDate(week.start)} to {formatMenuDate(week.end)}
                </p>
              </div>
              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-[var(--muted)]">
                {week.events.length} planned
              </span>
            </div>

            {week.events.length ? (
              <div className="mt-4 space-y-3">
                {week.events.map((event) => (
                  <MealEventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <p className="mt-4 rounded-3xl border border-dashed border-[var(--border)] p-6 text-sm leading-6 text-[var(--muted)]">
                Nothing planned yet. Pick a Recipe above and give future-you a small win.
              </p>
            )}
          </section>
        ))}
      </div>

      <section className="mt-10" aria-labelledby="unplanned-heading">
        <h2 id="unplanned-heading" className="text-2xl font-semibold tracking-tight">
          Unplanned
        </h2>
        {unplannedRecipes.length ? (
          <div className="mt-4 space-y-3">
            {unplannedRecipes.map((recipe) => (
              <Link
                key={recipe.id}
                href={`/cookbook/recipes/${recipe.id}`}
                className="block rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm"
              >
                <h3 className="text-lg font-semibold">{recipe.title}</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {recipe.servings ? `Serves ${recipe.servings}` : "Servings not set yet"}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            No loose meal ideas right now. Tidy, but suspiciously hungry.
          </p>
        )}
      </section>
    </>
  );
}
