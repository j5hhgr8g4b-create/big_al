import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[430px] items-center bg-[var(--color-bg)] px-6 py-10">
      <section className="warm-section w-full border-dashed p-8 text-center">
        <p className="section-kicker text-2xl">Nothing on the hob</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">That page is not here.</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
          It may have moved, been archived, or belonged to a different Restaurant.
        </p>
        <Link href="/" className="btn-primary mt-6">
          Back to Kitchen
        </Link>
      </section>
    </main>
  );
}
