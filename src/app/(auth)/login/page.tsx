import { signIn, signUp } from "@/app/(auth)/login/actions";
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
      <p className="mt-6 leading-7 text-[var(--color-text-muted)]">Your private cooking companion.</p>

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

      <section className="visual-card mt-5 p-6">
        <h2 className="section-kicker text-2xl">Create account</h2>
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
