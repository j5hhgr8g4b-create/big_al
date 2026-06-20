"use client";

import { archiveRecipe } from "@/app/(app)/cookbook/recipes/actions";

export function ArchiveRecipeButton({ recipeId }: { recipeId: string }) {
  return (
    <form
      action={archiveRecipe}
      onSubmit={(event) => {
        if (!globalThis.confirm("Archive this recipe? It will leave your active Cookbook.")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="recipeId" value={recipeId} />
      <button type="submit" className="text-sm font-semibold text-red-700">
        Archive recipe
      </button>
    </form>
  );
}
