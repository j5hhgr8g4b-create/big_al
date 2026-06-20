"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function createRestaurant(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();

  if (name.length < 1 || name.length > 100) {
    redirect("/restaurants/new?error=Restaurant+name+must+be+between+1+and+100+characters.");
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("create_restaurant", { restaurant_name: name });

  if (error) {
    redirect("/restaurants/new?error=We+could+not+create+your+Restaurant.+Please+try+again.");
  }

  redirect("/");
}
