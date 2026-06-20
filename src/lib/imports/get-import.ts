import "server-only";

import { createClient } from "@/lib/supabase/server";

export type ImportForReview = {
  created_at: string;
  id: string;
  parser_name: string;
  parser_output: { message?: string; status?: string };
  raw_text: string | null;
  restaurant_id: string;
  source_type: "text" | "url";
  source_url: string | null;
  status: "needs_review";
};

export async function getImportForReview(importId: string): Promise<ImportForReview | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("imports")
    .select(
      "id, restaurant_id, source_type, source_url, raw_text, status, parser_name, parser_output, created_at",
    )
    .eq("id", importId)
    .eq("status", "needs_review")
    .is("archived_at", null)
    .maybeSingle();

  return data as ImportForReview | null;
}
