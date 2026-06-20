type SectionIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionIntro({ eyebrow, title, description }: SectionIntroProps) {
  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
        {eyebrow}
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-4 max-w-sm text-base leading-7 text-[var(--muted)]">{description}</p>
    </section>
  );
}
