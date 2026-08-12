import type { ReactNode } from "react";
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
        <p className="brand-mark" aria-label="Big Al">
          BA
        </p>
        <form action={signOut}>
          <button
            type="submit"
            className="header-action transition-colors hover:bg-[var(--color-surface)]"
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
