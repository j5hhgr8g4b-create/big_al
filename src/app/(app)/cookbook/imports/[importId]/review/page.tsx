import { notFound } from "next/navigation";

import { RecipeForm } from "@/components/recipe-form";
import { getImportForReview } from "@/lib/imports/get-import";

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

  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
        Needs Review
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Structure this recipe</h1>
      <p className="mt-4 leading-7 text-[var(--muted)]">
        Check the source below, then add clean ingredients and ordered steps before saving it to your
        Cookbook.
      </p>

      <aside className="mt-6 rounded-3xl bg-orange-50 p-5 text-sm leading-6">
        <p className="font-semibold">Parser placeholder</p>
        <p className="mt-1 text-[var(--muted)]">
          {recipeImport.parser_output.message ??
            "Automatic parsing is not enabled. Review this Import manually."}
        </p>
        {recipeImport.source_url && (
          <a
            href={recipeImport.source_url}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block font-semibold text-[var(--accent)]"
          >
            Open source recipe
          </a>
        )}
        {recipeImport.raw_text && (
          <details className="mt-4">
            <summary className="cursor-pointer font-semibold">View pasted text</summary>
            <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl bg-white p-4 font-sans text-xs leading-5 text-[var(--muted)]">
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
        restaurantId={recipeImport.restaurant_id}
        initialValue={{
          cookMinutes: "",
          description: "",
          difficulty: "",
          imageUrl: "",
          ingredients: [{ name: "", preparation: "", quantity: "", unit: "" }],
          prepMinutes: "",
          servings: "",
          sourceUrl: recipeImport.source_url ?? "",
          steps: [""],
          title: "",
        }}
      />
    </section>
  );
}
