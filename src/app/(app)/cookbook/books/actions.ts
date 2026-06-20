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

function optionalHttpUrl(value: string) {
  if (!value) return "";

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? value : null;
  } catch {
    return null;
  }
}

export async function saveRecipeBook(formData: FormData) {
  const existingBookId = field(formData, "recipeBookId");
  const recipeBookId = existingBookId || randomUUID();
  const restaurantId = field(formData, "restaurantId");
  const title = field(formData, "title");
  const description = field(formData, "description");
  const coverImageUrl = optionalHttpUrl(field(formData, "coverImageUrl"));
  const returnPath = existingBookId
    ? `/cookbook/books/${existingBookId}/edit`
    : "/cookbook/books/new";

  if (!restaurantId || title.length < 1 || title.length > 120) {
    errorRedirect(returnPath, "Add a Recipe Book title of no more than 120 characters.");
  }

  if (description.length > 1000 || coverImageUrl === null) {
    errorRedirect(returnPath, "Check the description and use an http or https cover URL.");
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("save_recipe_book", {
    target_recipe_book_id: recipeBookId,
    target_restaurant_id: restaurantId,
    book_title: title,
    book_description: description,
    book_cover_image_url: coverImageUrl,
  });

  if (error) {
    errorRedirect(returnPath, "We could not save this Recipe Book.");
  }

  redirect(`/cookbook/books/${recipeBookId}`);
}

export async function archiveRecipeBook(formData: FormData) {
  const recipeBookId = field(formData, "recipeBookId");

  if (!recipeBookId) {
    redirect("/cookbook");
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("archive_recipe_book", {
    target_recipe_book_id: recipeBookId,
  });

  if (error) {
    errorRedirect(`/cookbook/books/${recipeBookId}/edit`, "We could not archive this Recipe Book.");
  }

  redirect("/cookbook");
}

export async function updateRecipeBooks(formData: FormData) {
  const recipeId = field(formData, "recipeId");
  const selectedBookIds = formData.getAll("recipeBookId").map(String);

  if (!recipeId) {
    redirect("/cookbook");
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("set_recipe_books", {
    target_recipe_id: recipeId,
    selected_recipe_book_ids: selectedBookIds,
  });

  if (error) {
    errorRedirect(`/cookbook/recipes/${recipeId}`, "We could not update the Recipe Books.");
  }

  redirect(`/cookbook/recipes/${recipeId}`);
}
