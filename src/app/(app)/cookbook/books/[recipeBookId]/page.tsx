import Link from "next/link";
import { notFound } from "next/navigation";

import { RecipeCard } from "@/components/recipe-card";
import { RecipeImage } from "@/components/recipe-image";
import { getRecipeBook } from "@/lib/recipe-books/get-recipe-book";

type RecipeBookPageProps = {
  params: Promise<{ recipeBookId: string }>;
};

export default async function RecipeBookPage({ params }: RecipeBookPageProps) {
  const { recipeBookId } = await params;
  const recipeBook = await getRecipeBook(recipeBookId);

  if (!recipeBook) {
    notFound();
  }

  return (
    <article>
      {recipeBook.cover_image_url && (
        <RecipeImage src={recipeBook.cover_image_url} title={recipeBook.title} />
      )}
      <div className={recipeBook.cover_image_url ? "mt-7" : ""}>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
          Recipe Book
        </p>
        <div className="mt-2 flex items-start justify-between gap-4">
          <h1 className="text-4xl font-semibold tracking-tight">{recipeBook.title}</h1>
          <Link
            href={`/cookbook/books/${recipeBook.id}/edit`}
            className="shrink-0 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold"
          >
            Edit
          </Link>
        </div>
        {recipeBook.description && (
          <p className="mt-4 leading-7 text-[var(--muted)]">{recipeBook.description}</p>
        )}
      </div>

      {recipeBook.recipes.length ? (
        <section className="mt-10 space-y-4" aria-label="Recipes in this Book">
          {recipeBook.recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </section>
      ) : (
        <section className="mt-10 rounded-3xl border border-dashed border-[var(--border)] p-8 text-center">
          <h2 className="text-xl font-semibold">This Recipe Book is empty</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Open a Recipe and use its Recipe Books section to add it here.
          </p>
        </section>
      )}
    </article>
  );
}
