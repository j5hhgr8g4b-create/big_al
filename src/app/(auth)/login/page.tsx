import Link from "next/link";

import { signIn, signInWithGoogle } from "@/app/(auth)/login/actions";
import { SubmitButton } from "@/components/submit-button";

type LoginPageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

const inputClassName =
  "input-control mt-2 px-4 py-3 text-base";

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, message } = await searchParams;

  return (
    <div>
      <p className="section-kicker">
        Welcome to
      </p>
      <h1 className="screen-title mt-2 inline-block text-5xl">Big Al</h1>
      <p className="mt-6 leading-7 text-[var(--color-text-muted)]">
        Your private cooking companion. Save something you want to cook, plan it, shop for it, then cook it.
      </p>

      {(error || message) && (
        <p
          role="status"
          className={`mt-6 rounded-2xl px-4 py-3 text-sm ${
            error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {error ?? message}
        </p>
      )}

      <section className="visual-card mt-8 p-6">
        <h2 className="section-kicker text-2xl">Sign in</h2>
        <form action={signInWithGoogle} className="mt-5">
          <SubmitButton pendingLabel="Opening Google…">Continue with Google</SubmitButton>
        </form>
        <div className="my-5 flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
          <span className="h-px flex-1 bg-[var(--color-border)]" />
          <span>or use email</span>
          <span className="h-px flex-1 bg-[var(--color-border)]" />
        </div>
        <form action={signIn} className="mt-5 space-y-4">
          <label className="block text-sm font-medium">
            Email
            <input className={inputClassName} name="email" type="email" autoComplete="email" required />
          </label>
          <label className="block text-sm font-medium">
            Password
            <input
              className={inputClassName}
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>
          <SubmitButton className="btn-secondary" pendingLabel="Signing in…">Sign in</SubmitButton>
        </form>
        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
          <Link href="/forgot-password" className="font-semibold text-[var(--color-purple-800)] underline">
            Forgot password?
          </Link>
          <Link href="/signup" className="font-semibold text-[var(--color-purple-800)] underline">
            Create account
          </Link>
        </div>
      </section>
    </div>
  );
}
