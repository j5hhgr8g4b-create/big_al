"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { resolveAuthRedirectOrigin } from "@/lib/auth/redirect-origin";
import { createClient } from "@/lib/supabase/server";

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function loginRedirect(key: "error" | "message", message: string): never {
  const params = new URLSearchParams({ [key]: message });
  redirect(`/login?${params.toString()}`);
}

function signUpError(message: string): never {
  redirect(`/signup?${new URLSearchParams({ error: message }).toString()}`);
}

export async function signIn(formData: FormData) {
  const email = field(formData, "email");
  const password = field(formData, "password");

  if (!email || !password) {
    loginRedirect("error", "Enter your email address and password.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.warn("[auth] sign in failed", { code: error.code });
    loginRedirect("error", "We could not sign you in. Check your email and password, then try again.");
  }

  redirect("/");
}

export async function signUp(formData: FormData) {
  const displayName = field(formData, "displayName");
  const email = field(formData, "email");
  const password = field(formData, "password");

  if (displayName.length < 1 || displayName.length > 80) {
    signUpError("Your display name must be between 1 and 80 characters.");
  }

  if (!email || password.length < 8) {
    signUpError("Enter a valid email and a password of at least 8 characters.");
  }

  const supabase = await createClient();
  const requestHeaders = await headers();
  const redirectOrigin = resolveAuthRedirectOrigin({
    configuredSiteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    forwardedHost: requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host"),
    forwardedProto: requestHeaders.get("x-forwarded-proto") ?? "https",
    requestOrigin: requestHeaders.get("origin"),
  });
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
      emailRedirectTo: `${redirectOrigin}/auth/callback`,
    },
  });

  if (error) {
    console.warn("[auth] sign up failed", { code: error.code });
    signUpError("We could not create that account. Check the details or try signing in instead.");
  }

  if (data.session) {
    redirect("/");
  }

  loginRedirect("message", "Check your email to confirm your account, then return here to sign in.");
}
