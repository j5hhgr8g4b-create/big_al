import Link from "next/link";
import { notFound } from "next/navigation";

import { RecipeBookPicker } from "@/components/recipe-book-picker";
import { RecipeImage } from "@/components/recipe-image";
import { SubmitButton } from "@/components/submit-button";
import { saveMealEvent } from "@/app/(app)/menu/actions";
import { getMenuDateRange } from "@/lib/menu/get-menu";
import { getRecipeDetail } from "@/lib/recipes/get-recipe";
import {
  cookingPreferenceSummary,
  getRestaurantCookingPreferences,
} from "@/lib/restaurants/preferences";
import { createClient } from "@/lib/supabase/server";

type RecipePageProps = {
  params: Promise<{ recipeId: string }>;
  searchParams: Promise<{ error?: string }>;
};

function displayQuantity(quantity: number | null) {
  if (quantity === null) return "";
  return Number(quantity).toLocaleString(undefined, { maximumFractionDigits: 3 });
}

function displayMinutes(minutes: number | null) {
  return minutes ? `${minutes} min` : "Not set";
}

function displayTotalMinutes(prepMinutes: number | null, cookMinutes: number | null) {
  const totalMinutes = (prepMinutes ?? 0) + (cookMinutes ?? 0);
  return totalMinutes ? `${totalMinutes} min` : "Not set";
}

function splitAttribution(description: string | null) {
  if (!description) {
    return { body: "", creatorSource: "" };
  }

  const attributionPattern = /(?:^|\n+)Creator\/source:\s*(.+)$/i;
  const match = description.match(attributionPattern);

  return {
    body: description.replace(attributionPattern, "").trim(),
    creatorSource: match?.[1]?.trim() ?? "",
  };
}

function hasStructuredIngredient(ingredient: {
  preparation: string | null;
  quantity: number | null;
  unit: string | null;
}) {
  return ingredient.quantity !== null || Boolean(ingredient.unit) || Boolean(ingredient.preparation);
}

export default async function RecipePage({ params, searchParams }: RecipePageProps) {
  const { recipeId } = await params;
  const { error } = await searchParams;
  const recipe = await getRecipeDetail(recipeId);

  if (!recipe) {
    notFound();
  }

  const description = splitAttribution(recipe.description);
  const creatorSource = recipe.creator_source ?? description.creatorSource;
  const sourceSite = recipe.source_site ?? "";
  const supabase = await createClient();
  const [booksResult, membershipsResult, preferences] = await Promise.all([
    supabase
      .from("recipe_books")
      .select("id, title")
      .eq("restaurant_id", recipe.restaurantId)
      .is("archived_at", null)
      .order("title"),
    supabase.from("recipe_book_recipes").select("recipe_book_id").eq("recipe_id", recipe.id),
    getRestaurantCookingPreferences(recipe.restaurantId),
  ]);
  const books = booksResult.data ?? [];
  const selectedBookIds = new Set(
    (membershipsResult.data ?? []).map((membership) => membership.recipe_book_id),
  );
  const menuRange = getMenuDateRange();
  const preferenceSummary = cookingPreferenceSummary(preferences);

  return (
    <article>
      {recipe.image_url && <RecipeImage src={recipe.image_url} title={recipe.title} />}
      <div className={recipe.image_url ? "mt-7" : ""}>
        <p className="section-kicker">
          {creatorSource ? `From ${creatorSource}` : `By ${recipe.creatorName}`}
        </p>
        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <h1 className="text-4xl font-semibold tracking-tight">{recipe.title}</h1>
          <div className="flex shrink-0 gap-2 sm:flex-col">
            <Link
              href={`/cookbook/recipes/${recipe.id}/cook`}
              className="btn-primary flex-1 px-5 py-3 text-sm sm:flex-none"
            >
              Cook
            </Link>
            <Link
              href={`/cookbook/recipes/${recipe.id}/edit`}
              className="btn-secondary flex-1 px-5 py-3 text-sm sm:flex-none"
            >
              Edit
            </Link>
          </div>
        </div>
        {description.body && (
          <p className="mt-4 whitespace-pre-line leading-7 text-[var(--color-text-muted)]">
            {description.body}
          </p>
        )}
        {(creatorSource || sourceSite || recipe.source_url) && (
          <div className="note-card mt-5 p-4 text-sm leading-6 text-[var(--color-text-soft)]">
            {creatorSource && (
              <p>
                Creator/source: <span className="font-semibold">{creatorSource}</span>
              </p>
            )}
            {sourceSite && (
              <p className={creatorSource ? "mt-2" : ""}>
                Source site: <span className="font-semibold">{sourceSite}</span>
              </p>
            )}
            {recipe.source_url && (
              <p className={creatorSource || sourceSite ? "mt-2 break-words" : "break-words"}>
                Source:{" "}
                <a
                  href={recipe.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[var(--accent)]"
                >
                  {recipe.source_url}
                </a>
              </p>
            )}
          </div>
        )}
        <dl className="mt-6 grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
          <div className="visual-card rounded-2xl p-3">
            <dt className="text-xs text-[var(--color-text-muted)]">Prep</dt>
            <dd className="mt-1 text-sm font-semibold">{displayMinutes(recipe.prep_minutes)}</dd>
          </div>
          <div className="visual-card rounded-2xl p-3">
            <dt className="text-xs text-[var(--color-text-muted)]">Cook</dt>
            <dd className="mt-1 text-sm font-semibold">{displayMinutes(recipe.cook_minutes)}</dd>
          </div>
          <div className="visual-card rounded-2xl p-3">
            <dt className="text-xs text-[var(--color-text-muted)]">Total</dt>
            <dd className="mt-1 text-sm font-semibold">
              {displayTotalMinutes(recipe.prep_minutes, recipe.cook_minutes)}
            </dd>
          </div>
          <div className="visual-card rounded-2xl p-3">
            <dt className="text-xs text-[var(--color-text-muted)]">Serves</dt>
            <dd className="mt-1 text-sm font-semibold">{recipe.servings ?? "Not set"}</dd>
          </div>
        </dl>
        {preferenceSummary.length > 0 && (
          <section className="note-card mt-5 p-4 text-sm leading-6 text-[var(--color-text-soft)]">
            <p className="font-semibold">Kitchen notes</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {preferenceSummary.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {error && (
        <p className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}

      <section className="mt-10">
        <h2 className="section-kicker text-2xl">Ingredients</h2>
        {recipe.ingredients.length ? (
          <ul className="visual-card mt-4 divide-y divide-[var(--color-border)] px-4">
            {recipe.ingredients.map((ingredient) => {
              const structured = hasStructuredIngredient(ingredient);

              return (
                <li
                  key={ingredient.id}
                  className="flex gap-3 py-3 leading-6"
                >
                  {structured ? (
                    <span className="min-w-16 font-semibold">
                      {[displayQuantity(ingredient.quantity), ingredient.unit].filter(Boolean).join(" ")}
                    </span>
                  ) : (
                    <span className="mt-2.5 size-2 shrink-0 rounded-full bg-[var(--color-honey)]" />
                  )}
                  <span>
                    {ingredient.name}
                    {ingredient.preparation && (
                      <span className="text-[var(--color-text-muted)]">, {ingredient.preparation}</span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="note-card mt-4 p-5 text-sm leading-6 text-[var(--color-text-soft)]">
            No ingredients are saved for this Recipe yet.
          </p>
        )}
      </section>

      <section className="mt-10">
        <h2 className="section-kicker text-2xl">Method</h2>
        {recipe.steps.length ? (
          <ol className="mt-5 space-y-5">
            {recipe.steps.map((step) => (
              <li key={step.id} className="flex gap-4">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--color-purple-800)] text-sm font-semibold text-[var(--color-text-inverse)]">
                  {step.position}
                </span>
                <p className="pt-1 leading-7">{step.instruction}</p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="note-card mt-4 p-5 text-sm leading-6 text-[var(--color-text-soft)]">
            No method steps are saved for this Recipe yet. Add steps before cooking.
          </p>
        )}
      </section>

      <section className="visual-card mt-10 p-5">
        <h2 className="section-kicker text-xl">Add to Menu</h2>
        <form action={saveMealEvent} className="mt-5 space-y-4">
          <input type="hidden" name="restaurantId" value={recipe.restaurantId} />
          <input type="hidden" name="recipeId" value={recipe.id} />
          <input type="hidden" name="returnPath" value={`/cookbook/recipes/${recipe.id}`} />
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm font-semibold">Date</span>
              <input
                name="plannedFor"
                type="date"
                required
                defaultValue={menuRange.thisWeekStart}
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
                defaultValue={recipe.servings ? Math.ceil(Number(recipe.servings)) : 2}
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
              <option value="breakfast">breakfast</option>
              <option value="lunch">lunch</option>
              <option value="dinner">dinner</option>
              <option value="snack">snack</option>
              <option value="other">other</option>
            </select>
          </label>
          <SubmitButton pendingLabel="Adding...">Add to Menu</SubmitButton>
        </form>
      </section>

      {books.length ? (
        <RecipeBookPicker books={books} recipeId={recipe.id} selectedIds={selectedBookIds} />
      ) : (
        <section className="visual-card mt-10 p-5">
          <h2 className="section-kicker text-xl">Recipe Books</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
            Create a Recipe Book to organize this Recipe.
          </p>
          <Link
            href="/cookbook/books/new"
            className="btn-secondary mt-4 min-h-0 px-3 py-2 text-xs"
          >
            New Recipe Book
          </Link>
        </section>
      )}
    </article>
  );
}
