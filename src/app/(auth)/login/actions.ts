"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function loginRedirect(key: "error" | "message", message: string): never {
  const params = new URLSearchParams({ [key]: message });
  redirect(`/login?${params.toString()}`);
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
    loginRedirect("error", error.message);
  }

  redirect("/");
}

export async function signUp(formData: FormData) {
  const displayName = field(formData, "displayName");
  const email = field(formData, "email");
  const password = field(formData, "password");

  if (displayName.length < 1 || displayName.length > 80) {
    loginRedirect("error", "Your display name must be between 1 and 80 characters.");
  }

  if (!email || password.length < 8) {
    loginRedirect("error", "Enter a valid email and a password of at least 8 characters.");
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
      emailRedirectTo: `${siteUrl.replace(/\/$/, "")}/auth/callback`,
    },
  });

  if (error) {
    loginRedirect("error", error.message);
  }

  if (data.session) {
    redirect("/");
  }

  loginRedirect("message", "Check your email to confirm your account.");
}
