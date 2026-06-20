"use client";

import { archiveRecipeBook } from "@/app/(app)/cookbook/books/actions";

export function ArchiveRecipeBookButton({ recipeBookId }: { recipeBookId: string }) {
  return (
    <form
      action={archiveRecipeBook}
      onSubmit={(event) => {
        if (!globalThis.confirm("Archive this Recipe Book? Its Recipes will remain in the Cookbook.")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="recipeBookId" value={recipeBookId} />
      <button type="submit" className="text-sm font-semibold text-red-700">
        Archive Recipe Book
      </button>
    </form>
  );
}
