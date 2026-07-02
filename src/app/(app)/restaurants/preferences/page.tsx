import Link from "next/link";
import { redirect } from "next/navigation";

import { saveRestaurantCookingPreferences } from "@/app/(app)/restaurants/preferences/actions";
import { SubmitButton } from "@/components/submit-button";
import { getCurrentRestaurant } from "@/lib/restaurants/current";
import {
  equipmentLimitOptions,
  getRestaurantCookingPreferences,
} from "@/lib/restaurants/preferences";

type PreferencesPageProps = {
  searchParams: Promise<{ error?: string; saved?: string }>;
};

const inputClassName = "input-control mt-2 px-4 py-3 text-base";

export default async function RestaurantPreferencesPage({ searchParams }: PreferencesPageProps) {
  const [{ error, saved }, { restaurant }] = await Promise.all([
    searchParams,
    getCurrentRestaurant(),
  ]);

  if (!restaurant) {
    redirect("/restaurants/new");
  }

  const preferences = await getRestaurantCookingPreferences(restaurant.id);
  const selectedEquipmentLimits = new Set(preferences.equipment_limits);

  return (
    <section>
      <p className="section-kicker">{restaurant.name}</p>
      <h1 className="screen-title mt-2 inline-block">Cooking preferences</h1>
      <p className="mt-6 leading-7 text-[var(--color-text-muted)]">
        Save simple kitchen defaults so Big Al can flag recipe details worth checking while you cook.
      </p>

      {saved && (
        <p className="note-card mt-6 px-4 py-3 text-sm font-semibold text-[var(--color-text-soft)]">
          Cooking preferences saved.
        </p>
      )}

      {error && (
        <p role="alert" className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <form action={saveRestaurantCookingPreferences} className="visual-card mt-8 space-y-6 p-6">
        <input type="hidden" name="restaurantId" value={restaurant.id} />

        <label className="block text-sm font-medium">
          Unit preference
          <select className={inputClassName} name="unitPreference" defaultValue={preferences.unit_preference}>
            <option value="mixed">Mixed</option>
            <option value="metric">Metric</option>
            <option value="us">US cups</option>
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            Oven type
            <select className={inputClassName} name="ovenType" defaultValue={preferences.oven_type}>
              <option value="not_set">Not set</option>
              <option value="conventional">Conventional</option>
              <option value="fan">Fan</option>
              <option value="gas">Gas</option>
              <option value="other">Other</option>
            </select>
          </label>

          <label className="block text-sm font-medium">
            Hob type
            <select className={inputClassName} name="hobType" defaultValue={preferences.hob_type}>
              <option value="not_set">Not set</option>
              <option value="gas">Gas</option>
              <option value="electric">Electric</option>
              <option value="induction">Induction</option>
              <option value="other">Other</option>
            </select>
          </label>
        </div>

        <fieldset>
          <legend className="text-sm font-semibold">Equipment limits</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {equipmentLimitOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3 text-sm font-medium"
              >
                <input
                  type="checkbox"
                  name="equipmentLimit"
                  value={option.value}
                  defaultChecked={selectedEquipmentLimits.has(option.value)}
                  className="size-4"
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col gap-3 sm:flex-row">
          <SubmitButton pendingLabel="Saving...">Save preferences</SubmitButton>
          <Link href="/" className="btn-secondary px-5 py-3 text-sm">
            Back to Kitchen
          </Link>
        </div>
      </form>
    </section>
  );
}
