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
      <button type="submit" className="btn-danger min-h-0 px-3 py-2 text-xs">
        Archive recipe
      </button>
    </form>
  );
}
