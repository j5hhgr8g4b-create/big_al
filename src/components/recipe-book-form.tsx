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
  "input-control mt-2 px-4 py-3 text-base";

export function RecipeBookForm({ initialValue, recipeBookId, restaurantId }: RecipeBookFormProps) {
  return (
    <form
      action={saveRecipeBook}
      className="visual-card mt-8 space-y-5 p-6"
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
