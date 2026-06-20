import Link from "next/link";

import { createRestaurant } from "@/app/(app)/restaurants/new/actions";
import { SubmitButton } from "@/components/submit-button";

type NewRestaurantPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NewRestaurantPage({ searchParams }: NewRestaurantPageProps) {
  const { error } = await searchParams;

  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
        Setup
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Create your Restaurant</h1>
      <p className="mt-4 leading-7 text-[var(--muted)]">
        Give your private cooking space a name. You can use your household, family, or kitchen name.
      </p>

      {error && (
        <p role="alert" className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <form
        action={createRestaurant}
        className="mt-8 rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm"
      >
        <label className="block text-sm font-medium">
          Restaurant name
          <input
            className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-base outline-none transition-shadow focus:border-[var(--accent)] focus:ring-2 focus:ring-orange-100"
            name="name"
            type="text"
            maxLength={100}
            autoFocus
            required
          />
        </label>
        <div className="mt-6 flex items-center gap-4">
          <SubmitButton pendingLabel="Creating…">Create Restaurant</SubmitButton>
          <Link href="/" className="text-sm font-medium text-[var(--muted)]">
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
