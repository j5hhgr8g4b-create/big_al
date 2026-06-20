import { redirect } from "next/navigation";

import { RecipeBookForm } from "@/components/recipe-book-form";
import { getCurrentRestaurant } from "@/lib/restaurants/current";

type NewRecipeBookPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NewRecipeBookPage({ searchParams }: NewRecipeBookPageProps) {
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
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">New Recipe Book</h1>
      <p className="mt-4 leading-7 text-[var(--muted)]">
        Group related Recipes without removing them from your main Cookbook.
      </p>
      {error && (
        <p role="alert" className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <RecipeBookForm restaurantId={restaurant.id} />
    </section>
  );
}
