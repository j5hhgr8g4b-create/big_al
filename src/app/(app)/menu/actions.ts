"use server";

import { randomUUID } from "node:crypto";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function errorRedirect(path: string, message: string): never {
  redirect(`${path}?${new URLSearchParams({ error: message }).toString()}`);
}

export async function saveMealEvent(formData: FormData) {
  const existingMealEventId = field(formData, "mealEventId");
  const mealEventId = existingMealEventId || randomUUID();
  const restaurantId = field(formData, "restaurantId");
  const recipeId = field(formData, "recipeId");
  const plannedFor = field(formData, "plannedFor");
  const mealType = field(formData, "mealType") || null;
  const returnPath = field(formData, "returnPath") || "/menu";
  const peopleEating = Number(field(formData, "peopleEating"));
  const notes = field(formData, "notes");

  if (!restaurantId || !recipeId || !plannedFor) {
    errorRedirect(returnPath, "Choose a Recipe and date for the Menu.");
  }

  if (!Number.isInteger(peopleEating) || peopleEating <= 0 || peopleEating > 100) {
    errorRedirect(returnPath, "Add how many people are eating.");
  }

  if (notes.length > 1000) {
    errorRedirect(returnPath, "Keep Menu notes under 1000 characters.");
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("save_meal_event", {
    target_meal_event_id: mealEventId,
    target_restaurant_id: restaurantId,
    target_recipe_id: recipeId,
    target_planned_for: plannedFor,
    target_meal_type: mealType,
    target_people_eating: peopleEating,
    target_notes: notes,
  });

  if (error) {
    errorRedirect(returnPath, "We could not add that Recipe to the Menu.");
  }

  redirect(returnPath);
}

export async function archiveMealEvent(formData: FormData) {
  const mealEventId = field(formData, "mealEventId");

  if (!mealEventId) {
    redirect("/menu");
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("archive_meal_event", {
    target_meal_event_id: mealEventId,
  });

  if (error) {
    errorRedirect("/menu", "We could not remove that meal from the Menu.");
  }

  redirect("/menu");
}
