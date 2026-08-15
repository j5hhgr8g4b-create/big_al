"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function updatePassword(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("passwordConfirmation") ?? "");

  if (password.length < 8) {
    redirect("/update-password?error=Your+new+password+must+be+at+least+8+characters.");
  }

  if (password !== confirmation) {
    redirect("/update-password?error=The+passwords+do+not+match.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.warn("[auth] password update failed", { code: error.code });
    redirect("/update-password?error=We+could+not+update+your+password.+Request+a+new+reset+link.");
  }

  await supabase.auth.signOut();
  redirect("/login?message=Password+updated.+Sign+in+with+your+new+password.");
}
