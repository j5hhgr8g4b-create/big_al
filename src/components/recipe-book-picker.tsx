import { updateRecipeBooks } from "@/app/(app)/cookbook/books/actions";
import { SubmitButton } from "@/components/submit-button";

type RecipeBookPickerProps = {
  books: Array<{ id: string; title: string }>;
  recipeId: string;
  selectedIds: Set<string>;
};

export function RecipeBookPicker({ books, recipeId, selectedIds }: RecipeBookPickerProps) {
  return (
    <form action={updateRecipeBooks} className="mt-10 rounded-3xl border border-[var(--border)] p-5">
      <input type="hidden" name="recipeId" value={recipeId} />
      <h2 className="text-xl font-semibold tracking-tight">Recipe Books</h2>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
        Recipe Books organize this Recipe without moving it from the Cookbook.
      </p>
      <div className="mt-4 space-y-3">
        {books.map((book) => (
          <label key={book.id} className="flex items-center gap-3 rounded-2xl bg-stone-50 px-4 py-3">
            <input
              type="checkbox"
              name="recipeBookId"
              value={book.id}
              defaultChecked={selectedIds.has(book.id)}
              className="size-4 accent-[var(--accent)]"
            />
            <span className="font-medium">{book.title}</span>
          </label>
        ))}
      </div>
      <div className="mt-5">
        <SubmitButton pendingLabel="Updating Books…">Update Recipe Books</SubmitButton>
      </div>
    </form>
  );
}
