import Link from "next/link";

import { signUp } from "@/app/(auth)/login/actions";
import { SubmitButton } from "@/components/submit-button";

type SignUpPageProps = {
  searchParams: Promise<{ error?: string }>;
};

const inputClassName = "input-control mt-2 px-4 py-3 text-base";

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const { error } = await searchParams;

  return (
    <div>
      <p className="section-kicker">Private beta</p>
      <h1 className="screen-title mt-2 inline-block">Create account</h1>
      <p className="mt-6 leading-7 text-[var(--color-text-muted)]">
        Make your Big Al account, confirm your email, then create your private Restaurant.
      </p>

      {error && (
        <p role="alert" className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <form action={signUp} className="visual-card mt-8 space-y-4 p-6">
        <label className="block text-sm font-medium">
          Display name
          <input
            className={inputClassName}
            name="displayName"
            type="text"
            autoComplete="name"
            maxLength={80}
            required
          />
        </label>
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
            autoComplete="new-password"
            minLength={8}
            required
          />
        </label>
        <SubmitButton pendingLabel="Creating account…">Create account</SubmitButton>
      </form>

      <p className="mt-6 text-sm text-[var(--color-text-muted)]">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[var(--color-purple-800)] underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
