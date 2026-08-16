"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { resolveAuthRedirectOrigin } from "@/lib/auth/redirect-origin";
import { createClient } from "@/lib/supabase/server";

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    redirect("/forgot-password?error=Enter+your+email+address.");
  }

  const requestHeaders = await headers();
  const redirectOrigin = resolveAuthRedirectOrigin({
    configuredSiteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    forwardedHost: requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host"),
    forwardedProto: requestHeaders.get("x-forwarded-proto") ?? "https",
    requestOrigin: requestHeaders.get("origin"),
  });
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${redirectOrigin}/auth/callback?next=/update-password`,
  });

  if (error) {
    console.warn("[auth] password reset request failed", { code: error.code });
  }

  redirect(
    "/forgot-password?message=If+an+account+exists+for+that+email%2C+we+sent+a+password+reset+link.",
  );
}
