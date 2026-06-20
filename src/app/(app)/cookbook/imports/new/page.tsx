import { createImport } from "@/app/(app)/cookbook/imports/actions";
import { SubmitButton } from "@/components/submit-button";
import { getCurrentRestaurant } from "@/lib/restaurants/current";
import { redirect } from "next/navigation";

type NewImportPageProps = {
  searchParams: Promise<{ error?: string }>;
};

const inputClassName =
  "mt-2 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-base outline-none transition-shadow focus:border-[var(--accent)] focus:ring-2 focus:ring-orange-100";

export default async function NewImportPage({ searchParams }: NewImportPageProps) {
  const { error } = await searchParams;
  const { restaurant } = await getCurrentRestaurant();

  if (!restaurant) {
    redirect("/restaurants/new");
  }

  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
        {restaurant.name}
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Import a recipe</h1>
      <p className="mt-4 leading-7 text-[var(--muted)]">
        Save a recipe link, paste recipe text, or add both. You will review and structure it next.
      </p>

      {error && (
        <p role="alert" className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <form
        action={createImport}
        className="mt-8 space-y-5 rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm"
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
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
          <span className="h-px flex-1 bg-[var(--border)]" />
          and/or
          <span className="h-px flex-1 bg-[var(--border)]" />
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
        <p className="rounded-2xl bg-orange-50 px-4 py-3 text-sm leading-6 text-[var(--muted)]">
          Automatic parsing is a placeholder in this milestone. Big Al stores the source safely and
          asks you to review the structured recipe before conversion.
        </p>
        <SubmitButton pendingLabel="Saving Import…">Continue to review</SubmitButton>
      </form>
    </section>
  );
}
