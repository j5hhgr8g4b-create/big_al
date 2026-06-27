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
    <article className="visual-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="section-kicker text-sm">
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
            className="btn-secondary min-h-0 px-3 py-1.5 text-xs"
          >
            Remove
          </button>
        </form>
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
        {servingsContext(event)}
      </p>
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
    <form action={saveMealEvent} className="visual-card mt-8 p-5">
      <input type="hidden" name="restaurantId" value={restaurantId} />
      <input type="hidden" name="returnPath" value="/menu" />
      <h2 className="section-kicker text-xl">Add Recipe to Menu</h2>
      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="text-sm font-semibold">Recipe</span>
          <select
            name="recipeId"
            required
            className="input-control mt-2 px-4 py-3 text-sm"
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
                className="input-control mt-2 px-4 py-3 text-sm"
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
                className="input-control mt-2 px-4 py-3 text-sm"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-semibold">Meal</span>
          <select
            name="mealType"
            defaultValue="dinner"
            className="input-control mt-2 px-4 py-3 text-sm capitalize"
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
            className="input-control mt-2 px-4 py-3 text-sm"
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
          className="btn-primary mt-8"
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
        <section className="warm-section mt-8 border-dashed p-8 text-center">
          <h2 className="text-xl font-semibold">No Recipes to plan yet</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
            Add a Recipe to your Cookbook, then it can come over here for dinner duty.
          </p>
          <Link
            href="/cookbook/imports/new"
            className="btn-secondary mt-4 min-h-0 px-3 py-2 text-xs"
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
                <h2 id={`${week.label.toLowerCase().replace(" ", "-")}-heading`} className="section-kicker text-2xl">
                  {week.label}
                </h2>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  {formatMenuDate(week.start)} to {formatMenuDate(week.end)}
                </p>
              </div>
              <span className="warm-pill">
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
              <p className="warm-section mt-4 border-dashed p-6 text-sm leading-6 text-[var(--color-text-muted)]">
                Nothing planned yet. Pick a Recipe above and give future-you a small win.
              </p>
            )}
          </section>
        ))}
      </div>

      <section className="mt-10" aria-labelledby="unplanned-heading">
        <h2 id="unplanned-heading" className="section-kicker text-2xl">
          Unplanned
        </h2>
        {unplannedRecipes.length ? (
          <div className="mt-4 space-y-3">
            {unplannedRecipes.map((recipe) => (
              <Link
                key={recipe.id}
                href={`/cookbook/recipes/${recipe.id}`}
                className="visual-card block p-5"
              >
                <h3 className="text-lg font-semibold">{recipe.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                  {recipe.servings ? `Serves ${recipe.servings}` : "Servings not set yet"}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
            No loose meal ideas right now. Tidy, but suspiciously hungry.
          </p>
        )}
      </section>
    </>
  );
}
