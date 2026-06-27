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
      <button type="submit" className="btn-danger min-h-0 px-3 py-2 text-xs">
        Archive Recipe Book
      </button>
    </form>
  );
}
