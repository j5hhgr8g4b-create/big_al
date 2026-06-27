import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

export default async function KitchenPage() {
  const supabase = await createClient();
  const { data: membership } = await supabase
    .from("restaurant_members")
    .select("restaurant_id")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const { data: restaurant } = membership
    ? await supabase
        .from("restaurants")
        .select("id, name")
        .eq("id", membership.restaurant_id)
        .single()
    : { data: null };

  return (
    <>
      <section className="grid grid-cols-[42px_1fr_42px] items-center gap-2 px-0 pb-2">
        <div aria-hidden="true" />
        <h1 className="screen-title justify-self-center">Kitchen</h1>
        <div aria-hidden="true" />
      </section>

      <section className="bistro-card" aria-label="Restaurant kitchen">
        <div className="bistro-badge">{restaurant?.name ?? "Your Restaurant"}</div>
        <p className="intro-copy-card">
          Dinner, the week ahead, and the shop — kept together without making a meal of it.
        </p>
      </section>

      {!restaurant && (
        <section className="visual-card mt-6 p-6">
          <p className="section-kicker">First things first</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">Create your Restaurant</h2>
          <p className="mt-3 leading-6 text-[var(--color-text-muted)]">
            Your Restaurant is the private home for your Cookbook, Menu, and shopping list.
          </p>
          <Link
            href="/restaurants/new"
            className="btn-primary mt-6"
          >
            Create Restaurant
          </Link>
        </section>
      )}

      {restaurant && (
        <section className="hero-card" aria-label="Next Dinner">
          <div className="hero-grid">
            <div>
              <p className="hand-label mb-2 text-base text-[rgba(255,252,246,.82)]">Next Dinner</p>
              <h2 className="hero-title">Tonight?</h2>
              <div className="mt-3 flex max-w-40 flex-wrap gap-1.5">
                <span className="pill">Pick a plate</span>
                <span className="pill">No faff</span>
              </div>
              <div className="mt-4 grid max-w-40 gap-2">
                <Link href="/cookbook/imports/new" className="btn-primary w-full">
                  Import Recipe
                </Link>
                <Link href="/cookbook" className="btn-ghost w-full">
                  Browse cookbook
                </Link>
              </div>
            </div>
            <div className="plate-wrap" aria-hidden="true">
              <div className="plate">
                <div className="greens" />
                <div className="sausage" />
                <div className="sausage two" />
              </div>
              <div className="stamp">
                Sausage
                <br />
                approved
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="mt-4 grid grid-cols-2 gap-3">
        <article className="visual-card col-span-2 flex min-h-32 flex-col items-center p-4 text-center">
          <p className="section-kicker">This week</p>
          <h2 className="mt-2 max-w-xs text-lg font-extrabold tracking-[-0.028em]">
            Build a week you’ll actually cook
          </h2>
          <p className="mt-2 max-w-xs text-sm leading-6 text-[var(--color-text-muted)]">
            Plan a few dinners, leave room for leftovers, and let the shopping list do the boring
            bits.
          </p>
          <div className="mt-3 flex justify-center gap-1.5" aria-label="Week overview">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
              <span
                key={`${day}-${index}`}
                className={`grid size-6 place-items-center rounded-full border text-[0.65rem] font-extrabold ${
                  index < 2
                    ? "border-[var(--color-green-600)] bg-[var(--color-green-600)] text-[var(--color-text-inverse)]"
                    : "border-[var(--color-border)] bg-[var(--color-surface-warm)] text-[var(--color-text-muted)]"
                }`}
              >
                {day}
              </span>
            ))}
          </div>
          <Link href="/menu" className="btn-secondary mt-3 min-h-0 px-3 py-2 text-xs">
            View Menu
          </Link>
        </article>

        <article className="visual-card flex min-h-32 flex-col items-center bg-[var(--color-surface-warm)] p-4 text-center">
          <p className="section-kicker">Pantry</p>
          <h2 className="mt-2 text-lg font-extrabold tracking-[-0.028em]">
            Shopping, not stock control
          </h2>
          <p className="mt-2 text-sm leading-5 text-[var(--color-text-muted)]">
            A simple list from your menu.
          </p>
          <Link href="/pantry" className="btn-secondary mt-auto min-h-0 px-3 py-2 text-xs">
            View Pantry
          </Link>
        </article>

        <article className="visual-card flex min-h-32 flex-col items-center p-4 text-center">
          <p className="section-kicker">Cookbook</p>
          <h2 className="mt-2 text-lg font-extrabold tracking-[-0.028em]">Save the good stuff</h2>
          <p className="mt-2 text-sm leading-5 text-[var(--color-text-muted)]">
            Recipes belong here before dinner.
          </p>
          <Link href="/cookbook" className="btn-secondary mt-auto min-h-0 px-3 py-2 text-xs">
            Open Cookbook
          </Link>
        </article>

        <article className="note-card col-span-2 p-4 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="grid size-9 place-items-center rounded-[13px] bg-[var(--color-purple-800)] text-xs font-extrabold text-[var(--color-text-inverse)] shadow-[0_3px_8px_rgba(43,23,65,.18)]">
              BA
            </div>
            <div>
              <h2 className="font-[var(--font-hand)] text-2xl font-bold">Big Al Says</h2>
              <p className="mt-1 max-w-xs text-sm leading-6 text-[var(--color-text-soft)]">
                Start with one recipe you’d genuinely cook tonight. Fancy systems can wait.
              </p>
            </div>
          </div>
        </article>
      </section>
    </>
  );
}
