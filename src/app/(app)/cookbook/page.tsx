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
  const { data: recipes } = cookbook
    ? await supabase
        .from("recipes")
        .select("id, title, description, prep_minutes, cook_minutes, servings, difficulty, created_at")
        .eq("cookbook_id", cookbook.id)
        .is("archived_at", null)
        .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <SectionIntro
          eyebrow={restaurant.name}
          title="Cookbook"
          description="Recipes saved for your Restaurant."
        />
        <Link
          href="/cookbook/recipes/new"
          className="shrink-0 rounded-full bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white"
        >
          Add recipe
        </Link>
      </div>

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
            Add your first recipe to start filling it.
          </p>
        </section>
      )}
    </>
  );
}
