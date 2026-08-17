import Link from "next/link";

import { RecipeImage } from "@/components/recipe-image";

export type RecipeCardValue = {
  cook_minutes: number | null;
  description: string | null;
  difficulty: string | null;
  id: string;
  image_url?: string | null;
  prep_minutes: number | null;
  servings: number | null;
  title: string;
};

export function RecipeCard({ recipe }: { recipe: RecipeCardValue }) {
  const totalMinutes = (recipe.prep_minutes ?? 0) + (recipe.cook_minutes ?? 0);

  return (
    <Link
      href={`/cookbook/recipes/${recipe.id}`}
      className="visual-card group block overflow-hidden transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
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
      <div className="p-4">
        <h3 className="line-clamp-2 text-base font-semibold leading-5 tracking-tight">
          {recipe.title}
        </h3>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {totalMinutes > 0 && <span className="warm-pill">{totalMinutes} min</span>}
          {recipe.difficulty && <span className="warm-pill capitalize">{recipe.difficulty}</span>}
        </div>
      </div>
    </Link>
  );
}
