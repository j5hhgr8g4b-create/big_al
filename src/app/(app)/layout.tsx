import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AuthenticatedAppShell } from "@/components/app-shell/authenticated-app-shell";
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

  return <AuthenticatedAppShell>{children}</AuthenticatedAppShell>;
}
