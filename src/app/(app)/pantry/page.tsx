import Link from "next/link";

import { SectionIntro } from "@/components/section-intro";
import { SubmitButton } from "@/components/submit-button";
import { formatMenuDate } from "@/lib/menu/get-menu";
import { getCurrentRestaurant } from "@/lib/restaurants/current";
import { getShoppingData, type ShoppingItem } from "@/lib/shopping/get-shopping";

import { addManualShoppingItem, generateShoppingList, toggleShoppingItemPurchased } from "./actions";

type PantryPageProps = {
  searchParams: Promise<{ error?: string }>;
};

function itemAmount(item: ShoppingItem) {
  if (!item.quantity && !item.unit) return null;
  if (!item.quantity) return item.unit;

  const quantity = Number(item.quantity).toLocaleString("en-GB", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });

  return item.unit ? `${quantity} ${item.unit}` : quantity;
}

function ShoppingItemRow({ item }: { item: ShoppingItem }) {
  const amount = itemAmount(item);

  return (
    <article className="visual-card p-4">
      <div className="flex items-start gap-3">
        <form action={toggleShoppingItemPurchased}>
          <input type="hidden" name="itemId" value={item.id} />
          <input type="hidden" name="isPurchased" value={String(!item.is_purchased)} />
          <button
            type="submit"
            aria-label={item.is_purchased ? `Put ${item.name} back on the list` : `Mark ${item.name} purchased`}
            className={`mt-0.5 grid size-7 place-items-center rounded-full border text-sm font-bold ${
              item.is_purchased
                ? "border-[var(--color-green-600)] bg-[var(--color-green-600)] text-white"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-transparent"
            }`}
          >
            ✓
          </button>
        </form>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <h3 className={`font-semibold ${item.is_purchased ? "text-[var(--color-text-muted)] line-through" : ""}`}>
              {item.name}
            </h3>
            {amount && <span className="text-sm font-medium text-[var(--color-text-muted)]">{amount}</span>}
          </div>
          <p className="section-kicker mt-1 text-sm">
            {item.source === "generated" ? "From Menu" : "Added by hand"}
          </p>
          {item.notes && (
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{item.notes}</p>
          )}
        </div>
      </div>
    </article>
  );
}

export default async function PantryPage({ searchParams }: PantryPageProps) {
  const { error } = await searchParams;
  const { restaurant, supabase } = await getCurrentRestaurant();

  if (!restaurant) {
    return (
      <>
        <SectionIntro
          eyebrow="Shopping list"
          title="Pantry"
          description="Create your Restaurant before building a shopping list."
        />
        <Link
          href="/restaurants/new"
          className="btn-primary mt-8"
        >
          Create Restaurant
        </Link>
      </>
    );
  }

  const { activeItems, list, plannedMealCount, purchasedItems, range } = await getShoppingData(
    supabase,
    restaurant.id,
  );

  return (
    <>
      <SectionIntro
        eyebrow={restaurant.name}
        title="Pantry"
        description="Turn planned meals into a practical shopping list, then tick things off at the store."
      />

      {error && (
        <p className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}

      <section className="visual-card mt-8 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="section-kicker">Plan → Shop → Cook</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Generate from Menu</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
              {plannedMealCount
                ? `${plannedMealCount} planned meals between ${formatMenuDate(range.thisWeekStart)} and ${formatMenuDate(range.nextWeekEnd)}.`
                : "Plan meals in Menu first, then Big Al can gather the ingredients here."}
            </p>
            {list?.generated_at && list.source_start_date && list.source_end_date && (
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                Last generated for {formatMenuDate(list.source_start_date)} to {formatMenuDate(list.source_end_date)}
              </p>
            )}
          </div>
          <form action={generateShoppingList}>
            <input type="hidden" name="restaurantId" value={restaurant.id} />
            <input type="hidden" name="startDate" value={range.thisWeekStart} />
            <input type="hidden" name="endDate" value={range.nextWeekEnd} />
            <SubmitButton pendingLabel="Generating...">
              {list ? "Regenerate list" : "Generate list"}
            </SubmitButton>
          </form>
        </div>
      </section>

      <form action={addManualShoppingItem} className="visual-card mt-6 p-5">
        <input type="hidden" name="restaurantId" value={restaurant.id} />
        <h2 className="section-kicker text-xl">Add item</h2>
        <div className="mt-4 grid gap-3">
          <label className="block">
            <span className="text-sm font-semibold">Item</span>
            <input
              name="name"
              required
              maxLength={120}
              placeholder="Milk, lemons, foil..."
              className="input-control mt-2 px-4 py-3 text-sm"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm font-semibold">Quantity</span>
              <input
                name="quantity"
                type="number"
                min="0.001"
                step="0.001"
                className="input-control mt-2 px-4 py-3 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Unit</span>
              <input
                name="unit"
                maxLength={40}
                placeholder="g, tin, bunch"
                className="input-control mt-2 px-4 py-3 text-sm"
              />
            </label>
          </div>
          <label className="block">
            <span className="text-sm font-semibold">Note</span>
            <input
              name="notes"
              maxLength={500}
              placeholder="Optional"
              className="input-control mt-2 px-4 py-3 text-sm"
            />
          </label>
        </div>
        <div className="mt-5">
          <SubmitButton pendingLabel="Adding...">Add item</SubmitButton>
        </div>
      </form>

      <section className="mt-10" aria-labelledby="shopping-list-heading">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="shopping-list-heading" className="section-kicker text-2xl">
              Shopping list
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              {activeItems.length} to buy · {purchasedItems.length} purchased
            </p>
          </div>
          <span className="warm-pill">
            {activeItems.length + purchasedItems.length
              ? `${purchasedItems.length}/${activeItems.length + purchasedItems.length} done`
              : "No list yet"}
          </span>
        </div>

        {activeItems.length ? (
          <div className="mt-4 space-y-3">
            {activeItems.map((item) => (
              <ShoppingItemRow key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="warm-section mt-4 border-dashed p-6 text-sm leading-6 text-[var(--color-text-muted)]">
            {list
              ? "Nothing left to buy. Add an item by hand or regenerate from the Menu when plans change."
              : "No shopping list yet. Generate one from planned meals or add a quick item by hand."}
          </p>
        )}
      </section>

      {purchasedItems.length > 0 && (
        <section className="mt-10" aria-labelledby="purchased-heading">
          <h2 id="purchased-heading" className="section-kicker text-2xl">
            Purchased
          </h2>
          <div className="mt-4 space-y-3">
            {purchasedItems.map((item) => (
              <ShoppingItemRow key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
