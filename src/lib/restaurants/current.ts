import "server-only";

import { createClient } from "@/lib/supabase/server";

export async function getCurrentRestaurant() {
  const supabase = await createClient();
  const { data: membership, error: membershipError } = await supabase
    .from("restaurant_members")
    .select("restaurant_id")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (membershipError) {
    throw new Error("Big Al could not resolve the current Restaurant.", {
      cause: membershipError,
    });
  }

  if (!membership) {
    return { restaurant: null, supabase };
  }

  const { data: restaurant, error: restaurantError } = await supabase
    .from("restaurants")
    .select("id, name")
    .eq("id", membership.restaurant_id)
    .is("archived_at", null)
    .maybeSingle();

  if (restaurantError) {
    throw new Error("Big Al could not load the current Restaurant.", {
      cause: restaurantError,
    });
  }

  return { restaurant, supabase };
}
