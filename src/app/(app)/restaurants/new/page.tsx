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
      <p className="section-kicker">
        Setup
      </p>
      <h1 className="screen-title mt-2 inline-block">Create your Restaurant</h1>
      <p className="mt-6 leading-7 text-[var(--color-text-muted)]">
        Give your private cooking space a name. You can use your household, family, or kitchen name.
      </p>

      {error && (
        <p role="alert" className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <form
        action={createRestaurant}
        className="visual-card mt-8 p-6"
      >
        <label className="block text-sm font-medium">
          Restaurant name
          <input
            className="input-control mt-2 px-4 py-3 text-base"
            name="name"
            type="text"
            maxLength={100}
            autoFocus
            required
          />
        </label>
        <div className="mt-6 flex items-center gap-4">
          <SubmitButton pendingLabel="Creating…">Create Restaurant</SubmitButton>
          <Link href="/" className="btn-secondary min-h-0 px-3 py-2 text-xs">
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
