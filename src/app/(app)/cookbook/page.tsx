import Link from "next/link";

import { RecipeCard, type RecipeCardValue } from "@/components/recipe-card";
import { SectionIntro } from "@/components/section-intro";
import { getCurrentRestaurant } from "@/lib/restaurants/current";

type CookbookPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function CookbookPage({ searchParams }: CookbookPageProps) {
  const { q } = await searchParams;
  const searchQuery = q?.trim().slice(0, 100) ?? "";
  const { restaurant, supabase } = await getCurrentRestaurant();

  if (!restaurant) {
    return (
      <>
        <SectionIntro
          eyebrow="Saved recipes"
          title="Cookbook"
          description="Create your Restaurant before adding recipes."
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

  const { data: cookbook } = await supabase
    .from("cookbooks")
    .select("id")
    .eq("restaurant_id", restaurant.id)
    .maybeSingle();
  const [recipesResult, importsResult, booksResult] = await Promise.all([
    searchQuery
      ? supabase.rpc("search_recipes", {
          target_restaurant_id: restaurant.id,
          search_query: searchQuery,
        })
      : cookbook
      ? supabase
          .from("recipes")
          .select("id, title, description, prep_minutes, cook_minutes, servings, difficulty, created_at")
          .eq("cookbook_id", cookbook.id)
          .is("archived_at", null)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] }),
    supabase
      .from("imports")
      .select("id, source_type, source_url, raw_text, created_at")
      .eq("restaurant_id", restaurant.id)
      .eq("status", "needs_review")
      .is("archived_at", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("recipe_books")
      .select("id, title, description, cover_image_url, created_at")
      .eq("restaurant_id", restaurant.id)
      .is("archived_at", null)
      .order("created_at", { ascending: false }),
  ]);
  const recipes = recipesResult.data;
  const pendingImports = importsResult.data;
  const recipeBooks = booksResult.data;

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <SectionIntro
          eyebrow={restaurant.name}
          title="Cookbook"
          description="Recipes saved for your Restaurant."
        />
        <Link
          href="/cookbook/imports/new"
          className="shrink-0 rounded-full bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white"
        >
          Import recipe
        </Link>
      </div>

      <form action="/cookbook" method="get" className="mt-8 flex gap-2">
        <label className="sr-only" htmlFor="recipe-search">
          Search Recipes
        </label>
        <input
          id="recipe-search"
          name="q"
          type="search"
          maxLength={100}
          defaultValue={searchQuery}
          placeholder="Search by title or ingredient"
          className="min-w-0 flex-1 rounded-full border border-[var(--border)] bg-white px-5 py-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-orange-100"
        />
        <button
          type="submit"
          className="rounded-full border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold"
        >
          Search
        </button>
      </form>

      {pendingImports?.length ? (
        <section className="mt-10" aria-labelledby="needs-review-heading">
          <div className="flex items-center justify-between">
            <h2 id="needs-review-heading" className="text-2xl font-semibold tracking-tight">
              Needs Review
            </h2>
            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-[var(--accent)]">
              {pendingImports.length}
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {pendingImports.map((recipeImport) => {
              const summary =
                recipeImport.source_url ??
                recipeImport.raw_text?.split("\n").find((line: string) => line.trim()) ??
                "Untitled Import";

              return (
                <Link
                  key={recipeImport.id}
                  href={`/cookbook/imports/${recipeImport.id}/review`}
                  className="block rounded-2xl border border-orange-100 bg-orange-50/60 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                    {recipeImport.source_type} Import
                  </p>
                  <p className="mt-1 truncate font-semibold">{summary}</p>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="mt-10" aria-labelledby="recipe-books-heading">
        <div className="flex items-center justify-between gap-4">
          <h2 id="recipe-books-heading" className="text-2xl font-semibold tracking-tight">
            Recipe Books
          </h2>
          <Link href="/cookbook/books/new" className="text-sm font-semibold text-[var(--accent)]">
            New Book
          </Link>
        </div>
        {recipeBooks?.length ? (
          <div className="mt-4 grid grid-cols-2 gap-3">
            {recipeBooks.map((book) => (
              <Link
                key={book.id}
                href={`/cookbook/books/${book.id}`}
                className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm"
              >
                <p className="font-semibold">{book.title}</p>
                {book.description && (
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--muted)]">
                    {book.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-[var(--muted)]">No Recipe Books yet.</p>
        )}
      </section>

      {recipes?.length ? (
        <section className="mt-10 space-y-4" aria-labelledby="recipes-heading">
          <div className="flex items-center justify-between gap-4">
            <h2 id="recipes-heading" className="text-2xl font-semibold tracking-tight">
              {searchQuery ? `Results for “${searchQuery}”` : "All Recipes"}
            </h2>
            {searchQuery && (
              <Link href="/cookbook" className="text-sm font-semibold text-[var(--accent)]">
                Clear
              </Link>
            )}
          </div>
          {recipes.map((recipe: RecipeCardValue) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </section>
      ) : (
        <section className="mt-10 rounded-3xl border border-dashed border-[var(--border)] p-8 text-center">
          <h2 className="text-xl font-semibold">
            {searchQuery ? "No matching Recipes" : "Your Cookbook is ready"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            {searchQuery
              ? "Try a different Recipe title or Ingredient."
              : "Import your first recipe to start filling it."}
          </p>
          {searchQuery && (
            <Link
              href="/cookbook"
              className="mt-4 inline-block text-sm font-semibold text-[var(--accent)]"
            >
              Clear search
            </Link>
          )}
        </section>
      )}
    </>
  );
}
