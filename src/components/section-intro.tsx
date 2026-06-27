type SectionIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionIntro({ eyebrow, title, description }: SectionIntroProps) {
  return (
    <section>
      <p className="section-kicker">{eyebrow}</p>
      <h1 className="screen-title mt-2 inline-block">{title}</h1>
      <p className="mt-6 max-w-sm text-base leading-7 text-[var(--color-text-muted)]">
        {description}
      </p>
    </section>
  );
}
