import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { signOut } from "@/app/(app)/actions";
import { BetaSupportLink } from "@/components/beta-support-link";
import { BottomNav } from "@/components/bottom-nav";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: Readonly<{ children: ReactNode }>) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims.sub) {
    const params = new URLSearchParams({
      message: "Sign in again to keep cooking with Big Al.",
    });
    redirect(`/login?${params.toString()}`);
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link href="/" className="topbar-icon" aria-label="Back to Kitchen">
          <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
        </Link>
        <Link href="/" className="brand-wordmark" aria-label="Big Al's Kitchen">
          Big Al&apos;s Kitchen
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            aria-label="Sign out"
            className="header-action transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            Sign out
          </button>
        </form>
      </header>
      <main className="app-main">{children}</main>
      <BetaSupportLink />
      <BottomNav />
    </div>
  );
}
