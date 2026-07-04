"use client";

import Link from "next/link";

type AppErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AppError({ error, reset }: AppErrorProps) {
  console.error("[app-error-boundary]", error);

  return (
    <section className="warm-section mt-6 border-dashed p-8 text-center">
      <p className="section-kicker text-2xl">Something stuck</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">Big Al could not load that bit.</h1>
      <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
        Try again. If it keeps happening, head back to Kitchen and start from there.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button type="button" onClick={reset} className="btn-primary">
          Try again
        </button>
        <Link href="/" className="btn-secondary">
          Back to Kitchen
        </Link>
      </div>
    </section>
  );
}
