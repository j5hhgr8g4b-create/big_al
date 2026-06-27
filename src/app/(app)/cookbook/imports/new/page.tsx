import { createImport } from "@/app/(app)/cookbook/imports/actions";
import { SubmitButton } from "@/components/submit-button";
import { getCurrentRestaurant } from "@/lib/restaurants/current";
import { redirect } from "next/navigation";

type NewImportPageProps = {
  searchParams: Promise<{ error?: string }>;
};

const inputClassName =
  "input-control mt-2 px-4 py-3 text-base";

export default async function NewImportPage({ searchParams }: NewImportPageProps) {
  const { error } = await searchParams;
  const { restaurant } = await getCurrentRestaurant();

  if (!restaurant) {
    redirect("/restaurants/new");
  }

  return (
    <section>
      <p className="section-kicker">
        {restaurant.name}
      </p>
      <h1 className="screen-title mt-2 inline-block">Import a recipe</h1>
      <p className="mt-6 leading-7 text-[var(--color-text-muted)]">
        Save a recipe link, paste recipe text, or add both. You will review and structure it next.
      </p>

      {error && (
        <p role="alert" className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <form
        action={createImport}
        className="visual-card mt-8 space-y-5 p-6"
      >
        <input type="hidden" name="restaurantId" value={restaurant.id} />
        <label className="block text-sm font-medium">
          Recipe URL
          <input
            className={inputClassName}
            name="sourceUrl"
            type="url"
            maxLength={2000}
            placeholder="https://example.com/recipe"
          />
        </label>
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          <span className="h-px flex-1 bg-[var(--color-border)]" />
          and/or
          <span className="h-px flex-1 bg-[var(--color-border)]" />
        </div>
        <label className="block text-sm font-medium">
          Recipe text
          <textarea
            className={`${inputClassName} min-h-56 resize-y`}
            name="rawText"
            maxLength={100000}
            placeholder="Paste ingredients and method here…"
          />
        </label>
        <p className="note-card px-4 py-3 text-sm leading-6 text-[var(--color-text-soft)]">
          Automatic parsing is a placeholder in this milestone. Big Al stores the source safely and
          asks you to review the structured recipe before conversion.
        </p>
        <SubmitButton pendingLabel="Saving Import…">Continue to review</SubmitButton>
      </form>
    </section>
  );
}
