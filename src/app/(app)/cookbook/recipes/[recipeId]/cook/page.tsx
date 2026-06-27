import Link from "next/link";
import { notFound } from "next/navigation";

import { SubmitButton } from "@/components/submit-button";
import { CookTimer } from "@/components/cook-timer";
import { getRecipeDetail, type RecipeDetail } from "@/lib/recipes/get-recipe";

import { markRecipeCooked, saveCookAgainFeedback } from "./actions";

type CookModePageProps = {
  params: Promise<{ recipeId: string }>;
  searchParams: Promise<{ cooked?: string; cookId?: string; error?: string; step?: string }>;
};

function displayQuantity(quantity: number | null) {
  if (quantity === null) return "";
  return Number(quantity).toLocaleString(undefined, { maximumFractionDigits: 3 });
}

function totalTime(recipe: RecipeDetail) {
  const totalMinutes = (recipe.prep_minutes ?? 0) + (recipe.cook_minutes ?? 0);
  return totalMinutes ? `${totalMinutes} min` : "Time not set";
}

function stepHref(recipeId: string, stepIndex: number) {
  return `/cookbook/recipes/${recipeId}/cook?step=${stepIndex + 1}`;
}

export default async function CookModePage({ params, searchParams }: CookModePageProps) {
  const { recipeId } = await params;
  const { cooked, cookId, error, step } = await searchParams;
  const recipe = await getRecipeDetail(recipeId);

  if (!recipe) {
    notFound();
  }

  const stepCount = recipe.steps.length;
  const requestedStep = Number(step ?? "1");
  const currentStepIndex =
    Number.isInteger(requestedStep) && requestedStep >= 1 && requestedStep <= stepCount
      ? requestedStep - 1
      : 0;
  const currentStep = recipe.steps[currentStepIndex];
  const progressPercent = Math.round(((currentStepIndex + 1) / stepCount) * 100);

  if (cooked === "yes") {
    return (
      <article className="-mx-4 -mt-6 min-h-[calc(100vh-104px)] bg-gradient-to-b from-[var(--color-purple-900)] to-[#1f1628] px-4 py-6 text-[var(--color-text-inverse)]">
        <p className="section-kicker text-[var(--color-honey)]">
          Cook Mode
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">{recipe.title}</h1>
        <section className="mt-8 rounded-[var(--radius-2xl)] border border-white/10 bg-white/8 p-7 text-center shadow-[var(--shadow-card)]">
          <p className="section-kicker text-[var(--color-honey)]">
            Marked cooked
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">How did that go?</h2>
          <p className="mt-3 leading-7 text-white/72">
            Big Al saved that this Recipe was cooked. Your answer here helps future trust signals like Times Cooked and Cook Again Rate.
          </p>
          {cookId ? (
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <form action={saveCookAgainFeedback}>
                <input type="hidden" name="recipeId" value={recipe.id} />
                <input type="hidden" name="recipeCookId" value={cookId} />
                <input type="hidden" name="cookAgain" value="true" />
                <SubmitButton pendingLabel="Saving...">Cook again</SubmitButton>
              </form>
              <form action={saveCookAgainFeedback}>
                <input type="hidden" name="recipeId" value={recipe.id} />
                <input type="hidden" name="recipeCookId" value={cookId} />
                <input type="hidden" name="cookAgain" value="false" />
                <button
                  type="submit"
                  className="btn-secondary w-full border-white/20 bg-white/10 px-6 py-4 text-base text-[var(--color-text-inverse)]"
                >
                  Done for now
                </button>
              </form>
            </div>
          ) : (
            <Link
              href={`/cookbook/recipes/${recipe.id}`}
              className="btn-secondary mt-7 border-white/20 bg-white/10 px-6 py-4 text-base text-[var(--color-text-inverse)]"
            >
              Back to Recipe
            </Link>
          )}
        </section>
      </article>
    );
  }

  return (
    <article className="-mx-4 -mt-6 min-h-[calc(100vh-104px)] bg-gradient-to-b from-[var(--color-purple-900)] to-[#1f1628] px-4 py-6 text-[var(--color-text-inverse)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="section-kicker text-[var(--color-honey)]">
            Cook Mode
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">{recipe.title}</h1>
        </div>
        <Link
          href={`/cookbook/recipes/${recipe.id}`}
          className="btn-secondary shrink-0 border-white/20 bg-white/10 px-4 py-2 text-sm text-[var(--color-text-inverse)]"
        >
          Exit
        </Link>
      </div>

      {error && (
        <p className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}

      <section className="mt-6 rounded-[var(--radius-2xl)] border border-white/10 bg-white/8 p-5 shadow-[var(--shadow-card)]">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xs text-white/62">Step</p>
            <p className="mt-1 text-lg font-semibold">
              {currentStepIndex + 1} / {stepCount}
            </p>
          </div>
          <div>
            <p className="text-xs text-white/62">Time</p>
            <p className="mt-1 text-lg font-semibold">{totalTime(recipe)}</p>
          </div>
          <div>
            <p className="text-xs text-white/62">Serves</p>
            <p className="mt-1 text-lg font-semibold">{recipe.servings ?? "—"}</p>
          </div>
        </div>
        <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/12">
          <div
            className="h-full rounded-full bg-[var(--color-honey)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </section>

      <section className="mt-6 rounded-[var(--radius-2xl)] border border-white/10 bg-white/10 p-7 shadow-[var(--shadow-card)]">
        <p className="section-kicker text-[var(--color-honey)]">
          Step {currentStep.position}
        </p>
        <p className="mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          {currentStep.instruction}
        </p>
      </section>

      <nav className="mt-6 grid grid-cols-2 gap-3" aria-label="Cook Mode steps">
        {currentStepIndex > 0 ? (
          <Link
            href={stepHref(recipe.id, currentStepIndex - 1)}
            className="btn-secondary border-white/20 bg-white/10 px-6 py-4 text-base text-[var(--color-text-inverse)]"
          >
            Previous
          </Link>
        ) : (
          <span className="rounded-[var(--radius-md)] border border-white/10 bg-white/5 px-6 py-4 text-center text-base font-semibold text-white/42">
            Previous
          </span>
        )}

        {currentStepIndex < stepCount - 1 ? (
          <Link
            href={stepHref(recipe.id, currentStepIndex + 1)}
            className="btn-primary px-6 py-4 text-base"
          >
            Next
          </Link>
        ) : (
          <form action={markRecipeCooked}>
            <input type="hidden" name="recipeId" value={recipe.id} />
            <SubmitButton pendingLabel="Marking...">Mark cooked</SubmitButton>
          </form>
        )}
      </nav>

      <div className="mt-6 space-y-4">
        <CookTimer />

        <details className="rounded-[var(--radius-2xl)] border border-white/10 bg-white/8 p-5 shadow-[var(--shadow-card)]">
          <summary className="cursor-pointer text-lg font-semibold tracking-tight">
            Ingredients
          </summary>
          <ul className="mt-4 divide-y divide-white/10">
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient.id} className="flex gap-3 py-3 leading-6">
                <span className="min-w-16 font-semibold">
                  {[displayQuantity(ingredient.quantity), ingredient.unit].filter(Boolean).join(" ")}
                </span>
                <span>
                  {ingredient.name}
                  {ingredient.preparation && (
                    <span className="text-white/62">, {ingredient.preparation}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </details>

        <p className="note-card p-5 text-sm leading-6 text-[var(--color-text-soft)]">
          Keep this screen open while you cook. Native screen-awake support is not wired in yet, so adjust your device sleep setting if you need extra time.
        </p>
      </div>
    </article>
  );
}
