"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { equipmentLimitOptions } from "@/lib/restaurants/preferences";

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function errorRedirect(message: string): never {
  redirect(`/restaurants/preferences?${new URLSearchParams({ error: message }).toString()}`);
}

function nameErrorRedirect(message: string): never {
  redirect(`/restaurants/preferences?${new URLSearchParams({ nameError: message }).toString()}`);
}

export async function updateRestaurantName(formData: FormData) {
  const restaurantId = field(formData, "restaurantId");
  const name = field(formData, "name");

  if (!restaurantId) {
    redirect("/restaurants/new");
  }

  if (name.length < 1 || name.length > 100) {
    nameErrorRedirect("Restaurant name must be between 1 and 100 characters.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("restaurants")
    .update({ name })
    .eq("id", restaurantId)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    nameErrorRedirect("Only the Restaurant owner can change its name.");
  }

  redirect("/restaurants/preferences?nameSaved=1");
}

export async function saveRestaurantCookingPreferences(formData: FormData) {
  const restaurantId = field(formData, "restaurantId");
  const unitPreference = field(formData, "unitPreference");
  const ovenType = field(formData, "ovenType");
  const hobType = field(formData, "hobType");
  const allowedEquipmentLimits = new Set<string>(equipmentLimitOptions.map((option) => option.value));
  const equipmentLimits = formData
    .getAll("equipmentLimit")
    .map(String)
    .filter((value) => allowedEquipmentLimits.has(value));

  if (!restaurantId) {
    redirect("/restaurants/new");
  }

  if (!["metric", "mixed", "us"].includes(unitPreference)) {
    errorRedirect("Choose a valid unit preference.");
  }

  if (!["not_set", "conventional", "fan", "gas", "other"].includes(ovenType)) {
    errorRedirect("Choose a valid oven type.");
  }

  if (!["not_set", "electric", "gas", "induction", "other"].includes(hobType)) {
    errorRedirect("Choose a valid hob type.");
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("save_restaurant_cooking_preferences", {
    target_equipment_limits: equipmentLimits,
    target_hob_type: hobType,
    target_oven_type: ovenType,
    target_restaurant_id: restaurantId,
    target_unit_preference: unitPreference,
  });

  if (error) {
    errorRedirect("Big Al could not save those cooking preferences. Try again.");
  }

  redirect("/restaurants/preferences?saved=1");
}
