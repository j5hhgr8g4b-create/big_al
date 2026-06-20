import { signIn, signUp } from "@/app/(auth)/login/actions";
import { SubmitButton } from "@/components/submit-button";

type LoginPageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

const inputClassName =
  "mt-2 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-base outline-none transition-shadow focus:border-[var(--accent)] focus:ring-2 focus:ring-orange-100";

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, message } = await searchParams;

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
        Welcome to
      </p>
      <h1 className="mt-2 text-5xl font-semibold tracking-tight">Big Al</h1>
      <p className="mt-3 leading-7 text-[var(--muted)]">Your private cooking companion.</p>

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

      <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight">Sign in</h2>
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
          <SubmitButton pendingLabel="Signing in…">Sign in</SubmitButton>
        </form>
      </section>

      <section className="mt-5 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight">Create account</h2>
        <form action={signUp} className="mt-5 space-y-4">
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
      </section>
    </div>
  );
}
