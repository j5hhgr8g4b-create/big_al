"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function errorRedirect(recipeId: string, message: string): never {
  redirect(
    `/cookbook/recipes/${recipeId}/cook?${new URLSearchParams({ error: message }).toString()}`,
  );
}

export async function markRecipeCooked(formData: FormData) {
  const recipeId = field(formData, "recipeId");

  if (!recipeId) {
    redirect("/cookbook");
  }

  const supabase = await createClient();
  const { data: recipeCookId, error } = await supabase.rpc("record_recipe_cooked", {
    target_recipe_id: recipeId,
  });

  if (error || !recipeCookId) {
    errorRedirect(recipeId, "We could not mark this Recipe cooked.");
  }

  redirect(
    `/cookbook/recipes/${recipeId}/cook?${new URLSearchParams({
      cooked: "yes",
      cookId: String(recipeCookId),
    }).toString()}`,
  );
}

export async function saveCookAgainFeedback(formData: FormData) {
  const recipeId = field(formData, "recipeId");
  const recipeCookId = field(formData, "recipeCookId");
  const cookAgain = field(formData, "cookAgain") === "true";

  if (!recipeId || !recipeCookId) {
    redirect(recipeId ? `/cookbook/recipes/${recipeId}/cook` : "/cookbook");
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("set_recipe_cook_again", {
    target_cook_again: cookAgain,
    target_recipe_cook_id: recipeCookId,
  });

  if (error) {
    errorRedirect(recipeId, "We could not save that cooking feedback.");
  }

  redirect(cookAgain ? `/cookbook/recipes/${recipeId}/cook?step=1` : `/cookbook/recipes/${recipeId}`);
}
