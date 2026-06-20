import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { signOut } from "@/app/(app)/actions";
import { BottomNav } from "@/components/bottom-nav";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: Readonly<{ children: ReactNode }>) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims.sub) {
    redirect("/login");
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-[var(--surface)] shadow-sm">
      <header className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
        <p className="text-lg font-semibold tracking-tight">Big Al</p>
        <form action={signOut}>
          <button
            type="submit"
            className="rounded-full border border-[var(--border)] px-3 py-1.5 text-sm font-medium text-[var(--muted)] transition-colors hover:bg-stone-50"
          >
            Sign out
          </button>
        </form>
      </header>
      <main className="min-h-[calc(100vh-4rem)] px-5 pb-28 pt-8">{children}</main>
      <BottomNav />
    </div>
  );
}
