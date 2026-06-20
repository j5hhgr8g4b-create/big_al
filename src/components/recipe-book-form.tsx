import { saveRecipeBook } from "@/app/(app)/cookbook/books/actions";
import { SubmitButton } from "@/components/submit-button";

type RecipeBookFormProps = {
  initialValue?: {
    coverImageUrl: string;
    description: string;
    title: string;
  };
  recipeBookId?: string;
  restaurantId: string;
};

const inputClassName =
  "mt-2 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-base outline-none transition-shadow focus:border-[var(--accent)] focus:ring-2 focus:ring-orange-100";

export function RecipeBookForm({ initialValue, recipeBookId, restaurantId }: RecipeBookFormProps) {
  return (
    <form
      action={saveRecipeBook}
      className="mt-8 space-y-5 rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm"
    >
      <input type="hidden" name="restaurantId" value={restaurantId} />
      <input type="hidden" name="recipeBookId" value={recipeBookId ?? ""} />
      <label className="block text-sm font-medium">
        Title
        <input
          className={inputClassName}
          name="title"
          maxLength={120}
          defaultValue={initialValue?.title}
          required
        />
      </label>
      <label className="block text-sm font-medium">
        Description
        <textarea
          className={`${inputClassName} min-h-28 resize-y`}
          name="description"
          maxLength={1000}
          defaultValue={initialValue?.description}
        />
      </label>
      <label className="block text-sm font-medium">
        Cover image URL
        <input
          className={inputClassName}
          name="coverImageUrl"
          type="url"
          maxLength={2000}
          defaultValue={initialValue?.coverImageUrl}
        />
      </label>
      <SubmitButton pendingLabel="Saving Recipe Book…">Save Recipe Book</SubmitButton>
    </form>
  );
}
