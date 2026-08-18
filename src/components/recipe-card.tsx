import Link from "next/link";

import { RecipeImage } from "@/components/recipe-image";
import { HouseFavouriteButton } from "@/components/house-favourite-button";

export type RecipeCardValue = {
  cook_minutes: number | null;
  description: string | null;
  difficulty: string | null;
  id: string;
  image_url?: string | null;
  house_favourite?: boolean;
  prep_minutes: number | null;
  servings: number | null;
  title: string;
};

export function RecipeCard({ recipe, restaurantId }: { recipe: RecipeCardValue; restaurantId: string }) {
  const totalMinutes = (recipe.prep_minutes ?? 0) + (recipe.cook_minutes ?? 0);

  return (
    <article className="visual-card group relative overflow-hidden transition-transform hover:-translate-y-0.5">
      <Link
        href={`/cookbook/recipes/${recipe.id}`}
        className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
      >
        <div className="aspect-[4/3] overflow-hidden bg-[var(--color-surface-warm)]">
          {recipe.image_url ? (
            <RecipeImage
              src={recipe.image_url}
              title={recipe.title}
              className="h-full w-full border-0 object-cover transition-transform duration-200 group-hover:scale-[1.02]"
            />
          ) : (
            <div
              className="grid h-full place-items-center bg-[radial-gradient(circle_at_35%_30%,rgba(216,168,91,.32),transparent_45%),linear-gradient(145deg,var(--color-surface-warm),var(--color-surface-soft))] px-4 text-center"
              role="img"
              aria-label={`No image available for ${recipe.title}`}
            >
              <span className="font-[var(--font-hand)] text-3xl font-bold text-[var(--color-purple-700)]" aria-hidden="true">
                {recipe.title.charAt(0).toUpperCase() || "R"}
              </span>
            </div>
          )}
        </div>
        <div className="p-4 pb-2">
          <h3 className="line-clamp-2 text-base font-semibold leading-5 tracking-tight">
            {recipe.title}
          </h3>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {totalMinutes > 0 && <span className="warm-pill">{totalMinutes} min</span>}
            {recipe.difficulty && <span className="warm-pill capitalize">{recipe.difficulty}</span>}
          </div>
        </div>
      </Link>
      <div className="flex min-h-14 items-center justify-end border-t border-[var(--color-border)] px-4 py-2">
        <HouseFavouriteButton
          isFavourite={Boolean(recipe.house_favourite)}
          recipeId={recipe.id}
          restaurantId={restaurantId}
          returnPath="/cookbook"
        />
      </div>
    </article>
  );
}
