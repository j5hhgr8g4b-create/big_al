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

function optionalServings(value: string) {
  if (!value) return null;
  const directNumber = Number(value);
  if (Number.isFinite(directNumber)) return directNumber;

  const match = value.match(/\d+(?:\.\d+)?/);
  if (!match) return Number.NaN;

  const parsedNumber = Number(match[0]);
  return Number.isFinite(parsedNumber) ? parsedNumber : Number.NaN;
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

function descriptionWithCreatorSource(description: string, creatorSource: string) {
  if (!creatorSource || description.includes(creatorSource)) {
    return description;
  }

  return [description, `Creator/source: ${creatorSource}`].filter(Boolean).join("\n\n");
}

export async function saveRecipe(formData: FormData) {
  const existingRecipeId = field(formData, "recipeId");
  const importId = field(formData, "importId");
  const recipeId = existingRecipeId || randomUUID();
  const restaurantId = field(formData, "restaurantId");
  const returnPath = existingRecipeId
    ? `/cookbook/recipes/${existingRecipeId}/edit`
    : importId
      ? `/cookbook/imports/${importId}/review`
      : "/cookbook/imports/new";
  const title = field(formData, "title");
  const description = descriptionWithCreatorSource(
    field(formData, "description"),
    field(formData, "creatorSource"),
  );
  const imageUrl = optionalHttpUrl(field(formData, "imageUrl"));
  const sourceUrl = optionalHttpUrl(field(formData, "sourceUrl"));
  const prepMinutes = optionalNumber(field(formData, "prepMinutes"));
  const enteredCookMinutes = optionalNumber(field(formData, "cookMinutes"));
  const totalMinutes = optionalNumber(field(formData, "totalMinutes"));
  const cookMinutes =
    enteredCookMinutes ??
    (totalMinutes !== null && !Number.isNaN(totalMinutes)
      ? Math.max(totalMinutes - (prepMinutes ?? 0), 0)
      : null);
  const servings = optionalServings(field(formData, "servings"));
  const difficulty = field(formData, "difficulty") || null;

  if (!existingRecipeId && !importId) {
    redirect("/cookbook/imports/new");
  }

  if (!restaurantId || title.length < 1 || title.length > 160) {
    errorRedirect(returnPath, "Add a recipe title of no more than 160 characters.");
  }

  if (imageUrl === null || sourceUrl === null) {
    errorRedirect(returnPath, "Image and source links must use http or https.");
  }

  if (
    Number.isNaN(prepMinutes) ||
    Number.isNaN(cookMinutes) ||
    Number.isNaN(totalMinutes) ||
    Number.isNaN(servings) ||
    (prepMinutes !== null && prepMinutes < 0) ||
    (cookMinutes !== null && cookMinutes < 0) ||
    (totalMinutes !== null && totalMinutes < 0) ||
    (servings !== null && servings <= 0)
  ) {
    errorRedirect(returnPath, "Times must be zero or more and servings must be greater than zero.");
  }

  const ingredientLines = field(formData, "ingredientLines")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const ingredients = ingredientLines.length
    ? ingredientLines.map((name) => ({
        name,
        preparation: "",
        quantity: null,
        unit: "",
      }))
    : formData.getAll("ingredientName").map(String).map((name, index) => {
        const quantities = formData.getAll("ingredientQuantity").map(String);
        const units = formData.getAll("ingredientUnit").map(String);
        const preparations = formData.getAll("ingredientPreparation").map(String);

        return {
          name: name.trim(),
          preparation: preparations[index]?.trim() ?? "",
          quantity: quantities[index]?.trim() || null,
          unit: units[index]?.trim() ?? "",
        };
      });
  const stepLines = field(formData, "stepLines")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const steps = (stepLines.length ? stepLines : formData.getAll("stepInstruction").map(String))
    .map((instruction) => ({ instruction: instruction.trim() }));

  if (ingredients.length < 1 || ingredients.some((ingredient) => !ingredient.name)) {
    errorRedirect(returnPath, "Add at least one named ingredient.");
  }

  if (ingredients.some((ingredient) => ingredient.name.length > 120)) {
    errorRedirect(returnPath, "Keep each ingredient to 120 characters or fewer.");
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

  if (steps.some((step) => step.instruction.length > 2000)) {
    errorRedirect(returnPath, "Keep each method step to 2000 characters or fewer.");
  }

  const supabase = await createClient();
  const recipePayload = {
    target_recipe_id: recipeId,
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
  };
  const { error } = importId
    ? await supabase.rpc("convert_import_to_recipe", {
        ...recipePayload,
        target_import_id: importId,
      })
    : await supabase.rpc("save_recipe", {
        ...recipePayload,
        target_restaurant_id: restaurantId,
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
