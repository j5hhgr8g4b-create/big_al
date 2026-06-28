import Link from "next/link";

import { RecipeCard, type RecipeCardValue } from "@/components/recipe-card";
import { SectionIntro } from "@/components/section-intro";
import { decodeParserOutputFallback } from "@/lib/imports/get-import";
import { getCurrentRestaurant } from "@/lib/restaurants/current";

type CookbookPageProps = {
  searchParams: Promise<{ q?: string }>;
};

type PendingImport = {
  id: string;
  parser_output?: {
    recipe?: {
      sourceSite?: string;
      title?: string;
    } | null;
    status?: string;
  } | null;
  raw_text: string | null;
  source_type: "text" | "url";
  source_url: string | null;
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
          className="btn-primary mt-8"
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
      .select("id, source_type, source_url, raw_text, parser_output, created_at")
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
          className="btn-primary shrink-0 px-4 py-2.5 text-sm"
        >
          Import recipe
        </Link>
      </div>

      <form action="/cookbook" method="get" className="visual-card mt-8 flex gap-2 p-3">
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
          className="input-control min-w-0 flex-1 rounded-[var(--radius-full)] px-5 py-3 text-sm"
        />
        <button
          type="submit"
          className="btn-secondary px-4 py-3 text-sm"
        >
          Search
        </button>
      </form>

      {pendingImports?.length ? (
        <section className="mt-10" aria-labelledby="needs-review-heading">
          <div className="flex items-center justify-between">
            <h2 id="needs-review-heading" className="section-kicker text-2xl">
              Needs Review
            </h2>
            <span className="warm-pill">
              {pendingImports.length}
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {(pendingImports as PendingImport[]).map((recipeImport) => {
              const fallbackEnvelope = decodeParserOutputFallback(recipeImport.raw_text);
              const parserOutput =
                recipeImport.parser_output?.status === "placeholder" && fallbackEnvelope
                  ? fallbackEnvelope.parserOutput
                  : recipeImport.parser_output;
              const extracted = parserOutput?.recipe;
              const rawText = fallbackEnvelope?.rawText ?? recipeImport.raw_text;
              const rawTextSummary = rawText?.split("\n").find((line) => line.trim());
              const summary =
                extracted?.title ||
                recipeImport.source_url ||
                rawTextSummary ||
                "Untitled Import";
              const meta = [
                parserOutput?.status === "success" ? "Extracted" : `${recipeImport.source_type} Import`,
                extracted?.sourceSite,
              ].filter(Boolean).join(" · ");

              return (
                <Link
                  key={recipeImport.id}
                  href={`/cookbook/imports/${recipeImport.id}/review`}
                  className="note-card block p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                    {meta}
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
          <h2 id="recipe-books-heading" className="section-kicker text-2xl">
            Recipe Books
          </h2>
          <Link href="/cookbook/books/new" className="btn-secondary min-h-0 px-3 py-2 text-xs">
            New Book
          </Link>
        </div>
        {recipeBooks?.length ? (
          <div className="mt-4 grid grid-cols-2 gap-3">
            {recipeBooks.map((book) => (
              <Link
                key={book.id}
                href={`/cookbook/books/${book.id}`}
                className="visual-card rounded-[var(--radius-xl)] p-4"
              >
                <p className="font-semibold">{book.title}</p>
                {book.description && (
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--color-text-muted)]">
                    {book.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-[var(--color-text-muted)]">No Recipe Books yet.</p>
        )}
      </section>

      {recipes?.length ? (
        <section className="mt-10 space-y-4" aria-labelledby="recipes-heading">
          <div className="flex items-center justify-between gap-4">
            <h2 id="recipes-heading" className="section-kicker text-2xl">
              {searchQuery ? `Results for “${searchQuery}”` : "All Recipes"}
            </h2>
            {searchQuery && (
              <Link href="/cookbook" className="btn-secondary min-h-0 px-3 py-2 text-xs">
                Clear
              </Link>
            )}
          </div>
          {recipes.map((recipe: RecipeCardValue) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </section>
      ) : (
        <section className="warm-section mt-10 border-dashed p-8 text-center">
          <h2 className="text-xl font-semibold">
            {searchQuery ? "No matching Recipes" : "Your Cookbook is ready"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
            {searchQuery
              ? "Try a different Recipe title or Ingredient."
              : "Import your first recipe to start filling it."}
          </p>
          {searchQuery && (
            <Link
              href="/cookbook"
              className="btn-secondary mt-4 min-h-0 px-3 py-2 text-xs"
            >
              Clear search
            </Link>
          )}
        </section>
      )}
    </>
  );
}
