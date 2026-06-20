"use server";

import { randomUUID } from "node:crypto";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function optionalNumber(value: string) {
  if (!value) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : Number.NaN;
}

function errorRedirect(path: string, message: string): never {
  redirect(`${path}?${new URLSearchParams({ error: message }).toString()}`);
}

function optionalHttpUrl(value: string) {
  if (!value) return "";

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? value : null;
  } catch {
    return null;
  }
}

export async function saveRecipe(formData: FormData) {
  const existingRecipeId = field(formData, "recipeId");
  const recipeId = existingRecipeId || randomUUID();
  const restaurantId = field(formData, "restaurantId");
  const returnPath = existingRecipeId
    ? `/cookbook/recipes/${existingRecipeId}/edit`
    : "/cookbook/recipes/new";
  const title = field(formData, "title");
  const description = field(formData, "description");
  const imageUrl = optionalHttpUrl(field(formData, "imageUrl"));
  const sourceUrl = optionalHttpUrl(field(formData, "sourceUrl"));
  const prepMinutes = optionalNumber(field(formData, "prepMinutes"));
  const cookMinutes = optionalNumber(field(formData, "cookMinutes"));
  const servings = optionalNumber(field(formData, "servings"));
  const difficulty = field(formData, "difficulty") || null;

  if (!restaurantId || title.length < 1 || title.length > 160) {
    errorRedirect(returnPath, "Add a recipe title of no more than 160 characters.");
  }

  if (imageUrl === null || sourceUrl === null) {
    errorRedirect(returnPath, "Image and source links must use http or https.");
  }

  if (
    Number.isNaN(prepMinutes) ||
    Number.isNaN(cookMinutes) ||
    Number.isNaN(servings) ||
    (prepMinutes !== null && prepMinutes < 0) ||
    (cookMinutes !== null && cookMinutes < 0) ||
    (servings !== null && servings <= 0)
  ) {
    errorRedirect(returnPath, "Times must be zero or more and servings must be greater than zero.");
  }

  const names = formData.getAll("ingredientName").map(String);
  const quantities = formData.getAll("ingredientQuantity").map(String);
  const units = formData.getAll("ingredientUnit").map(String);
  const preparations = formData.getAll("ingredientPreparation").map(String);
  const ingredients = names.map((name, index) => ({
    name: name.trim(),
    preparation: preparations[index]?.trim() ?? "",
    quantity: quantities[index]?.trim() || null,
    unit: units[index]?.trim() ?? "",
  }));
  const steps = formData
    .getAll("stepInstruction")
    .map(String)
    .map((instruction) => ({ instruction: instruction.trim() }));

  if (ingredients.length < 1 || ingredients.some((ingredient) => !ingredient.name)) {
    errorRedirect(returnPath, "Add at least one named ingredient.");
  }

  if (
    ingredients.some(
      (ingredient) =>
        ingredient.quantity !== null &&
        (!Number.isFinite(Number(ingredient.quantity)) || Number(ingredient.quantity) <= 0),
    )
  ) {
    errorRedirect(returnPath, "Ingredient quantities must be greater than zero.");
  }

  if (steps.length < 1 || steps.some((step) => !step.instruction)) {
    errorRedirect(returnPath, "Add at least one recipe step.");
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("save_recipe", {
    target_recipe_id: recipeId,
    target_restaurant_id: restaurantId,
    recipe_title: title,
    recipe_description: description,
    recipe_image_url: imageUrl,
    recipe_source_url: sourceUrl,
    recipe_prep_minutes: prepMinutes,
    recipe_cook_minutes: cookMinutes,
    recipe_servings: servings,
    recipe_difficulty: difficulty,
    ingredients_payload: ingredients,
    steps_payload: steps,
  });

  if (error) {
    errorRedirect(returnPath, "We could not save this recipe. Check the details and try again.");
  }

  redirect(`/cookbook/recipes/${recipeId}`);
}

export async function archiveRecipe(formData: FormData) {
  const recipeId = field(formData, "recipeId");

  if (!recipeId) {
    redirect("/cookbook");
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("archive_recipe", { target_recipe_id: recipeId });

  if (error) {
    errorRedirect(`/cookbook/recipes/${recipeId}/edit`, "We could not archive this recipe.");
  }

  redirect("/cookbook");
}
