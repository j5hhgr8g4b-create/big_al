"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function errorRedirect(message: string): never {
  redirect(`/pantry?${new URLSearchParams({ error: message }).toString()}`);
}

export async function generateShoppingList(formData: FormData) {
  const restaurantId = field(formData, "restaurantId");
  const startDate = field(formData, "startDate");
  const endDate = field(formData, "endDate");

  if (!restaurantId || !startDate || !endDate) {
    errorRedirect("Choose Menu dates before generating a shopping list.");
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("generate_shopping_list_from_meal_events", {
    target_end_date: endDate,
    target_restaurant_id: restaurantId,
    target_start_date: startDate,
  });

  if (error) {
    errorRedirect("We could not generate the shopping list.");
  }

  redirect("/pantry");
}

export async function addManualShoppingItem(formData: FormData) {
  const restaurantId = field(formData, "restaurantId");
  const name = field(formData, "name");
  const unit = field(formData, "unit");
  const notes = field(formData, "notes");
  const quantityValue = field(formData, "quantity");
  const quantity = quantityValue ? Number(quantityValue) : null;

  if (!restaurantId || !name) {
    errorRedirect("Add an item name before saving.");
  }

  if (quantity !== null && (!Number.isFinite(quantity) || quantity <= 0)) {
    errorRedirect("Use a positive quantity, or leave it blank.");
  }

  if (name.length > 120 || unit.length > 40 || notes.length > 500) {
    errorRedirect("That shopping item is too long.");
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("add_manual_shopping_item", {
    item_name: name,
    item_notes: notes,
    item_quantity: quantity,
    item_unit: unit,
    target_restaurant_id: restaurantId,
  });

  if (error) {
    errorRedirect("We could not add that shopping item.");
  }

  redirect("/pantry");
}

export async function toggleShoppingItemPurchased(formData: FormData) {
  const itemIds = field(formData, "itemId")
    .split(",")
    .map((itemId) => itemId.trim())
    .filter(Boolean);
  const isPurchased = field(formData, "isPurchased") === "true";

  if (itemIds.length === 0) {
    redirect("/pantry");
  }

  const supabase = await createClient();
  const results = await Promise.all(
    itemIds.map((itemId) =>
      supabase.rpc("set_shopping_item_purchased", {
        target_is_purchased: isPurchased,
        target_shopping_item_id: itemId,
      }),
    ),
  );

  if (results.some((result) => result.error)) {
    errorRedirect("We could not update that shopping item.");
  }

  redirect("/pantry");
}
