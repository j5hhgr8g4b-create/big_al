import Link from "next/link";

import { SectionIntro } from "@/components/section-intro";
import { getCurrentRestaurant } from "@/lib/restaurants/current";

export default async function CookbookPage() {
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
  const [recipesResult, importsResult] = await Promise.all([
    cookbook
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
  ]);
  const recipes = recipesResult.data;
  const pendingImports = importsResult.data;

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

      {recipes?.length ? (
        <section className="mt-10 space-y-4" aria-label="Recipes">
          {recipes.map((recipe) => {
            const totalMinutes = (recipe.prep_minutes ?? 0) + (recipe.cook_minutes ?? 0);

            return (
              <Link
                key={recipe.id}
                href={`/cookbook/recipes/${recipe.id}`}
                className="block rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm transition-transform hover:-translate-y-0.5"
              >
                <h2 className="text-xl font-semibold tracking-tight">{recipe.title}</h2>
                {recipe.description && (
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
                    {recipe.description}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-3 text-xs font-medium text-[var(--muted)]">
                  {totalMinutes > 0 && <span>{totalMinutes} min</span>}
                  {recipe.servings && <span>Serves {recipe.servings}</span>}
                  {recipe.difficulty && <span className="capitalize">{recipe.difficulty}</span>}
                </div>
              </Link>
            );
          })}
        </section>
      ) : (
        <section className="mt-10 rounded-3xl border border-dashed border-[var(--border)] p-8 text-center">
          <h2 className="text-xl font-semibold">Your Cookbook is ready</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Import your first recipe to start filling it.
          </p>
        </section>
      )}
    </>
  );
}
