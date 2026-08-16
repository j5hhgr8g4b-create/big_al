import Link from "next/link";
import { redirect } from "next/navigation";

import { updatePassword } from "@/app/(auth)/update-password/actions";
import { SubmitButton } from "@/components/submit-button";
import { createClient } from "@/lib/supabase/server";

type UpdatePasswordPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function UpdatePasswordPage({ searchParams }: UpdatePasswordPageProps) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !data?.claims.sub) {
    redirect("/forgot-password?error=Request+a+new+password+reset+link+to+continue.");
  }

  return (
    <div>
      <p className="section-kicker">Account security</p>
      <h1 className="screen-title mt-2 inline-block">Choose a new password</h1>
      <p className="mt-6 leading-7 text-[var(--color-text-muted)]">
        Use at least 8 characters. You will sign in again after the password is updated.
      </p>

      {error && (
        <p role="alert" className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <form action={updatePassword} className="visual-card mt-8 space-y-4 p-6">
        <label className="block text-sm font-medium">
          New password
          <input
            className="input-control mt-2 px-4 py-3 text-base"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </label>
        <label className="block text-sm font-medium">
          Confirm new password
          <input
            className="input-control mt-2 px-4 py-3 text-base"
            name="passwordConfirmation"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </label>
        <SubmitButton pendingLabel="Updating password…">Update password</SubmitButton>
      </form>

      <Link href="/login" className="mt-6 inline-block text-sm font-semibold text-[var(--color-purple-800)] underline">
        Back to sign in
      </Link>
    </div>
  );
}
