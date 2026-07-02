import { notFound } from "next/navigation";

import { RecipeForm } from "@/components/recipe-form";
import { getImportForReview, getSourceUrlDuplicateState } from "@/lib/imports/get-import";

type ReviewImportPageProps = {
  params: Promise<{ importId: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function ReviewImportPage({ params, searchParams }: ReviewImportPageProps) {
  const [{ importId }, { error }] = await Promise.all([params, searchParams]);
  const recipeImport = await getImportForReview(importId);

  if (!recipeImport) {
    notFound();
  }

  const extracted = recipeImport.parser_output.recipe;
  const sourceUrl = extracted?.sourceUrl || recipeImport.source_url || "";
  const duplicateState = sourceUrl
    ? await getSourceUrlDuplicateState(recipeImport.restaurant_id, sourceUrl, recipeImport.id)
    : { pendingImportId: null, recipeId: null };
  const extractionWorked = recipeImport.parser_output.status === "success";
  const extractionPartial = recipeImport.parser_output.status === "partial";
  const extractionLabel = extractionWorked
    ? "Extracted"
    : extractionPartial
      ? "Partly extracted"
      : "Fallback saved";

  return (
    <section>
      <p className="section-kicker">
        {extractionWorked ? "Ready for a check" : extractionPartial ? "Partial match" : "Needs a hand"}
      </p>
      <h1 className="screen-title mt-2 inline-block">Review recipe</h1>
      <p className="mt-6 leading-7 text-[var(--color-text-muted)]">
        {extractionWorked
          ? "Big Al has filled in what it found. Give it a quick check before saving it to your Cookbook."
          : extractionPartial
            ? "Big Al found some details. Check the gaps before saving it to your Cookbook."
            : "Big Al could not read this one automatically. The link is saved, and you can still add the recipe details below."}
      </p>

      <aside className="note-card mt-6 space-y-4 p-5 text-sm leading-6">
        <div className="flex flex-wrap gap-2">
          <span className="warm-pill bg-[var(--color-surface)]">
            {extractionLabel}
          </span>
          {extracted?.sourceSite && (
            <span className="warm-pill bg-[var(--color-surface)]">{extracted.sourceSite}</span>
          )}
          {extracted?.author && (
            <span className="warm-pill bg-[var(--color-surface)]">By {extracted.author}</span>
          )}
        </div>
        <p className="text-[var(--color-text-soft)]">
          {recipeImport.parser_output.message ??
            "Review this Import before saving it to your Cookbook."}
        </p>
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary mt-3 min-h-0 px-3 py-2 text-xs"
          >
            Open source recipe
          </a>
        )}
        {sourceUrl && (
          <p className="break-words text-xs text-[var(--color-text-muted)]">Source: {sourceUrl}</p>
        )}
        {duplicateState.recipeId && (
          <p className="rounded-2xl border border-[var(--color-note-border)] bg-[var(--color-surface)] px-4 py-3 font-semibold text-[var(--color-text-soft)]">
            This source link is already saved in your Cookbook. Check before saving another copy.
          </p>
        )}
        {!duplicateState.recipeId && duplicateState.pendingImportId && (
          <p className="rounded-2xl border border-[var(--color-note-border)] bg-[var(--color-surface)] px-4 py-3 font-semibold text-[var(--color-text-soft)]">
            Another pending Import uses this same source link. Review both before saving.
          </p>
        )}
        {recipeImport.raw_text && (
          <details className="mt-4">
            <summary className="cursor-pointer font-semibold">View pasted text</summary>
            <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl bg-[var(--color-surface)] p-4 font-sans text-xs leading-5 text-[var(--color-text-muted)]">
              {recipeImport.raw_text}
            </pre>
          </details>
        )}
      </aside>

      {error && (
        <p role="alert" className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <RecipeForm
        importId={recipeImport.id}
        mode="importReview"
        restaurantId={recipeImport.restaurant_id}
        initialValue={{
          cookMinutes: inputNumber(extracted?.cookMinutes),
          creatorSource: extracted?.author ?? "",
          description: extracted?.description ?? "",
          difficulty: "",
          imageUrl: extracted?.imageUrl ?? "",
          ingredients: (extracted?.ingredients?.length ? extracted.ingredients : [""]).map((name) => ({
            name,
            preparation: "",
            quantity: "",
            unit: "",
          })),
          prepMinutes: inputNumber(extracted?.prepMinutes),
          servings: extracted?.yield ?? "",
          sourceUrl,
          sourceSite: extracted?.sourceSite ?? "",
          steps: extracted?.instructions?.length ? extracted.instructions : [""],
          title: extracted?.title ?? "",
          totalMinutes: inputNumber(extracted?.totalMinutes),
        }}
      />
    </section>
  );
}

function inputNumber(value: number | null | undefined) {
  return value === null || value === undefined ? "" : String(value);
}
