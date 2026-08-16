import Link from "next/link";

import { requestPasswordReset } from "@/app/(auth)/forgot-password/actions";
import { SubmitButton } from "@/components/submit-button";

type ForgotPasswordPageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

export default async function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  const { error, message } = await searchParams;

  return (
    <div>
      <p className="section-kicker">Account help</p>
      <h1 className="screen-title mt-2 inline-block">Reset your password</h1>
      <p className="mt-6 leading-7 text-[var(--color-text-muted)]">
        Enter your account email and Supabase will send you a secure reset link.
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

      <form action={requestPasswordReset} className="visual-card mt-8 space-y-4 p-6">
        <label className="block text-sm font-medium">
          Email
          <input
            className="input-control mt-2 px-4 py-3 text-base"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </label>
        <SubmitButton pendingLabel="Sending reset link…">Send reset link</SubmitButton>
      </form>

      <Link href="/login" className="mt-6 inline-block text-sm font-semibold text-[var(--color-purple-800)] underline">
        Back to sign in
      </Link>
    </div>
  );
}
