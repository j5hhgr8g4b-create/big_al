"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { signOut } from "@/app/(app)/actions";
import { BetaSupportLink } from "@/components/beta-support-link";
import { BottomNav } from "@/components/bottom-nav";

export function AuthenticatedAppShell({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();

  if (pathname === "/") {
    return children;
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
