"use server";

import { randomUUID } from "node:crypto";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function errorRedirect(message: string): never {
  redirect(`/cookbook/imports/new?${new URLSearchParams({ error: message }).toString()}`);
}

export async function createImport(formData: FormData) {
  const importId = randomUUID();
  const restaurantId = field(formData, "restaurantId");
  const sourceUrl = field(formData, "sourceUrl");
  const rawText = field(formData, "rawText");

  if (!restaurantId || (!sourceUrl && !rawText)) {
    errorRedirect("Add a recipe URL, pasted recipe text, or both.");
  }

  if (sourceUrl) {
    try {
      const url = new URL(sourceUrl);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        errorRedirect("The recipe URL must use http or https.");
      }
    } catch {
      errorRedirect("Enter a valid recipe URL.");
    }
  }

  if (sourceUrl.length > 2000 || rawText.length > 100000) {
    errorRedirect("The imported content is too long.");
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("create_import", {
    target_import_id: importId,
    target_restaurant_id: restaurantId,
    import_source_url: sourceUrl,
    import_raw_text: rawText,
  });

  if (error) {
    errorRedirect("We could not save this Import. Please try again.");
  }

  redirect(`/cookbook/imports/${importId}/review`);
}
