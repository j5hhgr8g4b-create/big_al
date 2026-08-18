import { toggleHouseFavourite } from "@/app/(app)/cookbook/recipes/actions";

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 shrink-0"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
    </svg>
  );
}

export function HouseFavouriteButton({
  isFavourite,
  recipeId,
  restaurantId,
  returnPath,
}: {
  isFavourite: boolean;
  recipeId: string;
  restaurantId: string;
  returnPath: string;
}) {
  return (
    <form action={toggleHouseFavourite} className="house-favourite-form">
      <input type="hidden" name="recipeId" value={recipeId} />
      <input type="hidden" name="restaurantId" value={restaurantId} />
      <input type="hidden" name="returnPath" value={returnPath} />
      <input type="hidden" name="shouldMark" value={isFavourite ? "false" : "true"} />
      <button
        type="submit"
        aria-label={isFavourite ? "Remove from House Favourites" : "Add to House Favourites"}
        aria-pressed={isFavourite}
        title={isFavourite ? "Remove from House Favourites" : "Add to House Favourites"}
        className={`house-favourite-button inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border px-3 text-sm font-semibold shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] ${
          isFavourite
            ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-text-inverse)]"
            : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-purple-800)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        }`}
      >
        <StarIcon filled={isFavourite} />
        <span className="sr-only sm:not-sr-only">
          {isFavourite ? "House Favourite" : "Add to House Favourites"}
        </span>
      </button>
    </form>
  );
}
