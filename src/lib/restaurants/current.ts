import "server-only";

import { createClient } from "@/lib/supabase/server";

export async function getCurrentRestaurant() {
  const supabase = await createClient();
  const { data: membership } = await supabase
    .from("restaurant_members")
    .select("restaurant_id")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!membership) {
    return { restaurant: null, supabase };
  }

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("id, name")
    .eq("id", membership.restaurant_id)
    .is("archived_at", null)
    .maybeSingle();

  return { restaurant, supabase };
}
