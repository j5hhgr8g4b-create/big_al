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
      <article>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
          Cook Mode
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">{recipe.title}</h1>
        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-white p-7 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
            Marked cooked
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">How did that go?</h2>
          <p className="mt-3 leading-7 text-[var(--muted)]">
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
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-[var(--border)] px-6 py-4 text-center text-base font-semibold"
                >
                  Done for now
                </button>
              </form>
            </div>
          ) : (
            <Link
              href={`/cookbook/recipes/${recipe.id}`}
              className="mt-7 inline-flex rounded-full border border-[var(--border)] px-6 py-4 text-base font-semibold"
            >
              Back to Recipe
            </Link>
          )}
        </section>
      </article>
    );
  }

  return (
    <article>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
            Cook Mode
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">{recipe.title}</h1>
        </div>
        <Link
          href={`/cookbook/recipes/${recipe.id}`}
          className="shrink-0 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold"
        >
          Exit
        </Link>
      </div>

      {error && (
        <p className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}

      <section className="mt-6 rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xs text-[var(--muted)]">Step</p>
            <p className="mt-1 text-lg font-semibold">
              {currentStepIndex + 1} / {stepCount}
            </p>
          </div>
          <div>
            <p className="text-xs text-[var(--muted)]">Time</p>
            <p className="mt-1 text-lg font-semibold">{totalTime(recipe)}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--muted)]">Serves</p>
            <p className="mt-1 text-lg font-semibold">{recipe.servings ?? "—"}</p>
          </div>
        </div>
        <div className="mt-5 h-3 overflow-hidden rounded-full bg-stone-100">
          <div
            className="h-full rounded-full bg-[var(--accent)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-[var(--border)] bg-white p-7 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
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
            className="rounded-full border border-[var(--border)] bg-white px-6 py-4 text-center text-base font-semibold shadow-sm"
          >
            Previous
          </Link>
        ) : (
          <span className="rounded-full border border-[var(--border)] bg-stone-100 px-6 py-4 text-center text-base font-semibold text-[var(--muted)]">
            Previous
          </span>
        )}

        {currentStepIndex < stepCount - 1 ? (
          <Link
            href={stepHref(recipe.id, currentStepIndex + 1)}
            className="rounded-full bg-[var(--accent)] px-6 py-4 text-center text-base font-semibold text-white shadow-sm"
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

        <details className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm">
          <summary className="cursor-pointer text-lg font-semibold tracking-tight">
            Ingredients
          </summary>
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
        </details>

        <p className="rounded-3xl border border-[var(--border)] bg-orange-50/60 p-5 text-sm leading-6 text-[var(--muted)]">
          Keep this screen open while you cook. Native screen-awake support is not wired in yet, so adjust your device sleep setting if you need extra time.
        </p>
      </div>
    </article>
  );
}
