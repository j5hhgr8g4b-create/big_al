import { notFound } from "next/navigation";

import { ArchiveRecipeButton } from "@/components/archive-recipe-button";
import { RecipeForm } from "@/components/recipe-form";
import { getRecipeDetail } from "@/lib/recipes/get-recipe";

type EditRecipePageProps = {
  params: Promise<{ recipeId: string }>;
  searchParams: Promise<{ error?: string }>;
};

function inputNumber(value: number | null) {
  return value === null ? "" : String(value);
}

export default async function EditRecipePage({ params, searchParams }: EditRecipePageProps) {
  const [{ recipeId }, { error }] = await Promise.all([params, searchParams]);
  const recipe = await getRecipeDetail(recipeId);

  if (!recipe) {
    notFound();
  }

  return (
    <section>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="section-kicker">
            Cookbook
          </p>
          <h1 className="screen-title mt-2 inline-block">Edit recipe</h1>
        </div>
        <ArchiveRecipeButton recipeId={recipe.id} />
      </div>
      {error && (
        <p role="alert" className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <RecipeForm
        recipeId={recipe.id}
        restaurantId={recipe.restaurantId}
        initialValue={{
          cookMinutes: inputNumber(recipe.cook_minutes),
          description: recipe.description ?? "",
          difficulty: recipe.difficulty ?? "",
          imageUrl: recipe.image_url ?? "",
          ingredients: recipe.ingredients.map((ingredient) => ({
            name: ingredient.name,
            preparation: ingredient.preparation ?? "",
            quantity: inputNumber(ingredient.quantity),
            unit: ingredient.unit ?? "",
          })),
          prepMinutes: inputNumber(recipe.prep_minutes),
          servings: inputNumber(recipe.servings),
          sourceUrl: recipe.source_url ?? "",
          steps: recipe.steps.map((step) => step.instruction),
          title: recipe.title,
        }}
      />
    </section>
  );
}
