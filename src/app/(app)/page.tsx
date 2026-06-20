import Link from "next/link";

import { SectionIntro } from "@/components/section-intro";
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
      <SectionIntro
        eyebrow={restaurant?.name ?? "Your Restaurant"}
        title="Kitchen"
        description="Tonight's meal, upcoming plans, and helpful next steps will live here."
      />

      {!restaurant && (
        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-orange-50/60 p-6">
          <p className="text-sm font-semibold text-[var(--accent)]">First things first</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">Create your Restaurant</h2>
          <p className="mt-3 leading-6 text-[var(--muted)]">
            Your Restaurant is the private home for your Cookbook, Menu, and shopping list.
          </p>
          <Link
            href="/restaurants/new"
            className="mt-6 inline-flex rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Create Restaurant
          </Link>
        </section>
      )}
    </>
  );
}
