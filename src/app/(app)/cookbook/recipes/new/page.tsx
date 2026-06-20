import { redirect } from "next/navigation";

import { RecipeForm } from "@/components/recipe-form";
import { getCurrentRestaurant } from "@/lib/restaurants/current";

type NewRecipePageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NewRecipePage({ searchParams }: NewRecipePageProps) {
  const { error } = await searchParams;
  const { restaurant } = await getCurrentRestaurant();

  if (!restaurant) {
    redirect("/restaurants/new");
  }

  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
        {restaurant.name}
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Add recipe</h1>
      <p className="mt-4 leading-7 text-[var(--muted)]">
        Keep ingredients structured and write the method in the order you cook it.
      </p>
      {error && (
        <p role="alert" className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <RecipeForm restaurantId={restaurant.id} />
    </section>
  );
}
