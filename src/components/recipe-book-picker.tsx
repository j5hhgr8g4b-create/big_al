import { updateRecipeBooks } from "@/app/(app)/cookbook/books/actions";
import { SubmitButton } from "@/components/submit-button";

type RecipeBookPickerProps = {
  books: Array<{ id: string; title: string }>;
  recipeId: string;
  selectedIds: Set<string>;
};

export function RecipeBookPicker({ books, recipeId, selectedIds }: RecipeBookPickerProps) {
  return (
    <form action={updateRecipeBooks} className="visual-card mt-10 p-5">
      <input type="hidden" name="recipeId" value={recipeId} />
      <h2 className="section-kicker text-xl">Recipe Books</h2>
      <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
        Recipe Books organize this Recipe without moving it from the Cookbook.
      </p>
      <div className="mt-4 space-y-3">
        {books.map((book) => (
          <label
            key={book.id}
            className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3"
          >
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
