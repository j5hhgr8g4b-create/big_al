import "server-only";

import { createClient } from "@/lib/supabase/server";

export type UnitPreference = "metric" | "mixed" | "us";
export type OvenType = "conventional" | "fan" | "gas" | "not_set" | "other";
export type HobType = "electric" | "gas" | "induction" | "not_set" | "other";

export type RestaurantCookingPreferences = {
  equipment_limits: string[];
  hob_type: HobType;
  oven_type: OvenType;
  restaurant_id: string;
  unit_preference: UnitPreference;
};

export const defaultCookingPreferences = {
  equipment_limits: [],
  hob_type: "not_set",
  oven_type: "not_set",
  unit_preference: "mixed",
} satisfies Omit<RestaurantCookingPreferences, "restaurant_id">;

export const equipmentLimitOptions = [
  { label: "No blender", value: "no_blender" },
  { label: "No food processor", value: "no_food_processor" },
  { label: "No stand mixer", value: "no_stand_mixer" },
  { label: "No microwave", value: "no_microwave" },
  { label: "No air fryer", value: "no_air_fryer" },
  { label: "Small oven", value: "small_oven" },
  { label: "Limited pans", value: "limited_pans" },
] as const;

export const hobTypeLabels: Record<HobType, string> = {
  electric: "Electric hob",
  gas: "Gas hob",
  induction: "Induction hob",
  not_set: "Not set",
  other: "Other hob",
};

export const ovenTypeLabels: Record<OvenType, string> = {
  conventional: "Conventional oven",
  fan: "Fan oven",
  gas: "Gas oven",
  not_set: "Not set",
  other: "Other oven",
};

export const unitPreferenceLabels: Record<UnitPreference, string> = {
  metric: "Metric",
  mixed: "Mixed",
  us: "US cups",
};

export async function getRestaurantCookingPreferences(restaurantId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("restaurant_cooking_preferences")
    .select("restaurant_id, unit_preference, oven_type, hob_type, equipment_limits")
    .eq("restaurant_id", restaurantId)
    .maybeSingle();

  return {
    ...defaultCookingPreferences,
    ...(data ?? {}),
    restaurant_id: restaurantId,
  } as RestaurantCookingPreferences;
}

export function cookingPreferenceSummary(preferences: RestaurantCookingPreferences) {
  const equipmentLabels = preferences.equipment_limits
    .map((value) => equipmentLimitOptions.find((option) => option.value === value)?.label)
    .filter(Boolean);

  return [
    preferences.unit_preference !== "mixed"
      ? `Units: ${unitPreferenceLabels[preferences.unit_preference]}`
      : "",
    preferences.oven_type !== "not_set"
      ? ovenTypeLabels[preferences.oven_type]
      : "",
    preferences.hob_type !== "not_set"
      ? hobTypeLabels[preferences.hob_type]
      : "",
    equipmentLabels.length ? `Equipment limits: ${equipmentLabels.join(", ")}` : "",
  ].filter(Boolean);
}
