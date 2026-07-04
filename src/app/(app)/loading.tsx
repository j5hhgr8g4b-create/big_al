export default function AppLoading() {
  return (
    <section className="visual-card mt-6 p-6" role="status" aria-live="polite">
      <p className="section-kicker text-xl">Loading</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">Getting the kitchen ready...</h1>
      <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
        Fetching the latest Restaurant bits.
      </p>
    </section>
  );
}
