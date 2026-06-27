import { notFound } from "next/navigation";

import { ArchiveRecipeBookButton } from "@/components/archive-recipe-book-button";
import { RecipeBookForm } from "@/components/recipe-book-form";
import { getRecipeBook } from "@/lib/recipe-books/get-recipe-book";

type EditRecipeBookPageProps = {
  params: Promise<{ recipeBookId: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EditRecipeBookPage({ params, searchParams }: EditRecipeBookPageProps) {
  const [{ recipeBookId }, { error }] = await Promise.all([params, searchParams]);
  const recipeBook = await getRecipeBook(recipeBookId);

  if (!recipeBook) {
    notFound();
  }

  return (
    <section>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="section-kicker">
            Cookbook
          </p>
          <h1 className="screen-title mt-2 inline-block">Edit Recipe Book</h1>
        </div>
        <ArchiveRecipeBookButton recipeBookId={recipeBook.id} />
      </div>
      {error && (
        <p role="alert" className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <RecipeBookForm
        recipeBookId={recipeBook.id}
        restaurantId={recipeBook.restaurant_id}
        initialValue={{
          coverImageUrl: recipeBook.cover_image_url ?? "",
          description: recipeBook.description ?? "",
          title: recipeBook.title,
        }}
      />
    </section>
  );
}
