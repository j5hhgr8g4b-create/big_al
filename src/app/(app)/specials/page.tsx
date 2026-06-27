import Link from "next/link";

import { SectionIntro } from "@/components/section-intro";
import {
  getBigAlData,
  normalizeBigAlMode,
  recipeReason,
  type BigAlMode,
  type BigAlRecipe,
} from "@/lib/big-al/get-big-al";
import { getCurrentRestaurant } from "@/lib/restaurants/current";

type SpecialsPageProps = {
  searchParams: Promise<{ mode?: string; q?: string }>;
};

const prompts: { href: string; label: string; mode: BigAlMode }[] = [
  { href: "/specials?mode=suggest", label: "Suggest something", mode: "suggest" },
  { href: "/specials?mode=saved", label: "Find saved Recipes", mode: "saved" },
  { href: "/specials?mode=planned", label: "What is planned?", mode: "planned" },
  { href: "/specials?mode=recent", label: "Cooked recently", mode: "recent" },
  { href: "/specials?mode=cook-again", label: "Cook again winners", mode: "cook-again" },
];

function totalMinutes(recipe: Pick<BigAlRecipe, "cook_minutes" | "prep_minutes">) {
  return (recipe.prep_minutes ?? 0) + (recipe.cook_minutes ?? 0);
}

function BigAlRecipeCard({ recipe }: { recipe: BigAlRecipe }) {
  const time = totalMinutes(recipe);

  return (
    <Link
      href={`/cookbook/recipes/${recipe.id}`}
      className="visual-card block p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold tracking-tight">{recipe.title}</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
            {recipeReason(recipe)}
          </p>
        </div>
        {recipe.cookAgainCount > 0 && (
          <span className="warm-pill shrink-0 text-[var(--color-accent)]">
            Cook again
          </span>
        )}
      </div>
      {recipe.description && (
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--color-text-muted)]">
          {recipe.description}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {time > 0 && <span className="warm-pill">{time} min</span>}
        {recipe.servings && <span className="warm-pill">Serves {recipe.servings}</span>}
        {recipe.ingredients.slice(0, 3).map((ingredient) => (
          <span className="warm-pill" key={ingredient}>
            {ingredient}
          </span>
        ))}
      </div>
    </Link>
  );
}

export default async function SpecialsPage({ searchParams }: SpecialsPageProps) {
  const { mode: modeParam, q } = await searchParams;
  const mode = normalizeBigAlMode(modeParam);
  const query = q?.trim().slice(0, 80) ?? "";
  const { restaurant, supabase } = await getCurrentRestaurant();

  if (!restaurant) {
    return (
      <>
        <SectionIntro
          eyebrow="Basic Big Al"
          title="Specials"
          description="Create your Restaurant before Big Al can help with saved Recipes."
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

  const { answer, recipeCount, shoppingTodoCount } = await getBigAlData(
    supabase,
    restaurant.id,
    mode,
    query,
  );

  return (
    <>
      <SectionIntro
        eyebrow={restaurant.name}
        title="Specials"
        description="Basic Big Al helps with your saved Recipes, Menu and cook history. No internet, no paid AI, no made-up dinner wizardry."
      />

      <section className="visual-card mt-8 p-5">
        <p className="section-kicker">Tasting board</p>
        <form action="/specials" method="get" className="mt-4 flex gap-2">
          <input type="hidden" name="mode" value="find" />
          <label className="sr-only" htmlFor="big-al-search">
            Search stored Recipes
          </label>
          <input
            id="big-al-search"
            name="q"
            type="search"
            maxLength={80}
            defaultValue={query}
            placeholder="Find chicken, pasta, rice..."
            className="input-control min-w-0 flex-1 rounded-[var(--radius-full)] px-5 py-3 text-sm"
          />
          <button
            type="submit"
            className="btn-primary px-5 py-3 text-sm"
          >
            Ask
          </button>
        </form>
        <p className="mt-3 text-xs leading-5 text-[var(--color-text-muted)]">
          Big Al searches titles, Ingredients and method steps already saved in this Restaurant.
        </p>
      </section>

      <section className="mt-6" aria-labelledby="suggested-prompts-heading">
        <h2 id="suggested-prompts-heading" className="section-kicker text-lg">
          Suggested prompts
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {prompts.map((prompt) => (
            <Link
              key={prompt.href}
              href={prompt.href}
              className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                mode === prompt.mode
                  ? "border-[var(--color-purple-800)] bg-[var(--color-purple-800)] text-[var(--color-text-inverse)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)]"
              }`}
            >
              {prompt.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="note-card mt-8 p-6">
        <p className="section-kicker">
          Big Al says
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">{answer.title}</h2>
        <p className="mt-3 leading-7 text-[var(--color-text-soft)]">{answer.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="warm-pill bg-[var(--color-surface)]">{recipeCount} saved Recipes</span>
          <span className="warm-pill bg-[var(--color-surface)]">{shoppingTodoCount} Shopping items open</span>
          <span className="warm-pill bg-[var(--color-surface)]">No paid AI provider</span>
        </div>
      </section>

      {answer.recipes.length ? (
        <section className="mt-8 space-y-3" aria-labelledby="big-al-results-heading">
          <h2 id="big-al-results-heading" className="section-kicker text-2xl">
            Grounded picks
          </h2>
          {answer.recipes.map((recipe) => (
            <BigAlRecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </section>
      ) : (
        <section className="warm-section mt-8 border-dashed p-8 text-center">
          <h2 className="text-xl font-semibold">Not enough to go on yet</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
            {answer.emptyLabel ?? "Add Recipes, plan meals or cook something first. I will keep it honest."}
          </p>
          <Link
            href="/cookbook/imports/new"
            className="btn-secondary mt-4 min-h-0 px-3 py-2 text-xs"
          >
            Import a Recipe
          </Link>
        </section>
      )}
    </>
  );
}
