/* eslint-disable @next/next/no-img-element */

export function RecipeImage({
  className = "aspect-[4/3] w-full rounded-[var(--radius-2xl)] border border-[var(--color-border)] object-cover shadow-[var(--shadow-card)]",
  src,
  title,
}: {
  className?: string;
  src: string;
  title: string;
}) {
  return (
    <img
      src={src}
      alt={title}
      className={className}
      referrerPolicy="no-referrer"
    />
  );
}
