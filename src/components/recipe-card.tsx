import Link from "next/link";

export type RecipeCardValue = {
  cook_minutes: number | null;
  description: string | null;
  difficulty: string | null;
  id: string;
  prep_minutes: number | null;
  servings: number | null;
  title: string;
};

export function RecipeCard({ recipe }: { recipe: RecipeCardValue }) {
  const totalMinutes = (recipe.prep_minutes ?? 0) + (recipe.cook_minutes ?? 0);

  return (
    <Link
      href={`/cookbook/recipes/${recipe.id}`}
      className="block rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm transition-transform hover:-translate-y-0.5"
    >
      <h3 className="text-xl font-semibold tracking-tight">{recipe.title}</h3>
      {recipe.description && (
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">{recipe.description}</p>
      )}
      <div className="mt-4 flex flex-wrap gap-3 text-xs font-medium text-[var(--muted)]">
        {totalMinutes > 0 && <span>{totalMinutes} min</span>}
        {recipe.servings && <span>Serves {recipe.servings}</span>}
        {recipe.difficulty && <span className="capitalize">{recipe.difficulty}</span>}
      </div>
    </Link>
  );
}
