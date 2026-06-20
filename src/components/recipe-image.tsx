/* eslint-disable @next/next/no-img-element */

export function RecipeImage({ src, title }: { src: string; title: string }) {
  return (
    <img
      src={src}
      alt={title}
      className="aspect-[4/3] w-full rounded-3xl object-cover"
      referrerPolicy="no-referrer"
    />
  );
}
