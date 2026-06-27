/* eslint-disable @next/next/no-img-element */

export function RecipeImage({ src, title }: { src: string; title: string }) {
  return (
    <img
      src={src}
      alt={title}
      className="aspect-[4/3] w-full rounded-[var(--radius-2xl)] border border-[var(--color-border)] object-cover shadow-[var(--shadow-card)]"
      referrerPolicy="no-referrer"
    />
  );
}
