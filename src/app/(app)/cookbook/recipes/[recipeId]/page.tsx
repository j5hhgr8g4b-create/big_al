import Link from "next/link";
import { notFound } from "next/navigation";

import { RecipeImage } from "@/components/recipe-image";
import { getRecipeDetail } from "@/lib/recipes/get-recipe";

type RecipePageProps = {
  params: Promise<{ recipeId: string }>;
};

function displayQuantity(quantity: number | null) {
  if (quantity === null) return "";
  return Number(quantity).toLocaleString(undefined, { maximumFractionDigits: 3 });
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { recipeId } = await params;
  const recipe = await getRecipeDetail(recipeId);

  if (!recipe) {
    notFound();
  }

  const totalMinutes = (recipe.prep_minutes ?? 0) + (recipe.cook_minutes ?? 0);

  return (
    <article>
      {recipe.image_url && <RecipeImage src={recipe.image_url} title={recipe.title} />}
      <div className={recipe.image_url ? "mt-7" : ""}>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
          By {recipe.creatorName}
        </p>
        <div className="mt-2 flex items-start justify-between gap-4">
          <h1 className="text-4xl font-semibold tracking-tight">{recipe.title}</h1>
          <Link
            href={`/cookbook/recipes/${recipe.id}/edit`}
            className="shrink-0 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold"
          >
            Edit
          </Link>
        </div>
        {recipe.description && (
          <p className="mt-4 leading-7 text-[var(--muted)]">{recipe.description}</p>
        )}
        <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl bg-stone-50 p-3">
            <dt className="text-xs text-[var(--muted)]">Time</dt>
            <dd className="mt-1 text-sm font-semibold">{totalMinutes ? `${totalMinutes} min` : "—"}</dd>
          </div>
          <div className="rounded-2xl bg-stone-50 p-3">
            <dt className="text-xs text-[var(--muted)]">Servings</dt>
            <dd className="mt-1 text-sm font-semibold">{recipe.servings ?? "—"}</dd>
          </div>
          <div className="rounded-2xl bg-stone-50 p-3">
            <dt className="text-xs text-[var(--muted)]">Difficulty</dt>
            <dd className="mt-1 text-sm font-semibold capitalize">{recipe.difficulty ?? "—"}</dd>
          </div>
        </dl>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold tracking-tight">Ingredients</h2>
        <ul className="mt-4 divide-y divide-[var(--border)]">
          {recipe.ingredients.map((ingredient) => (
            <li key={ingredient.id} className="flex gap-3 py-3 leading-6">
              <span className="min-w-16 font-semibold">
                {[displayQuantity(ingredient.quantity), ingredient.unit].filter(Boolean).join(" ")}
              </span>
              <span>
                {ingredient.name}
                {ingredient.preparation && (
                  <span className="text-[var(--muted)]">, {ingredient.preparation}</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold tracking-tight">Method</h2>
        <ol className="mt-5 space-y-5">
          {recipe.steps.map((step) => (
            <li key={step.id} className="flex gap-4">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--accent)] text-sm font-semibold text-white">
                {step.position}
              </span>
              <p className="pt-1 leading-7">{step.instruction}</p>
            </li>
          ))}
        </ol>
      </section>

      {recipe.source_url && (
        <p className="mt-10 border-t border-[var(--border)] pt-6 text-sm text-[var(--muted)]">
          Source: {" "}
          <a
            href={recipe.source_url}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[var(--accent)]"
          >
            View original
          </a>
        </p>
      )}
    </article>
  );
}
