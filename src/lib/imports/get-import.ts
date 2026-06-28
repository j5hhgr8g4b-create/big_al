import "server-only";

import type { RecipeExtractionResult } from "@/lib/imports/recipe-url-extractor";
import { createClient } from "@/lib/supabase/server";

const parserFallbackEnvelope = "big-al-import-parser-output-v1";

export type ExtractedRecipeForReview = {
  author?: string;
  cookMinutes?: number | null;
  description?: string;
  imageUrl?: string;
  ingredients?: string[];
  instructions?: string[];
  prepMinutes?: number | null;
  sourceSite?: string;
  sourceUrl?: string;
  title?: string;
  totalMinutes?: number | null;
  yield?: string;
};

export type ImportForReview = {
  created_at: string;
  id: string;
  parser_name: string;
  parser_output: {
    message?: string;
    recipe?: ExtractedRecipeForReview | null;
    status?: string;
  };
  raw_text: string | null;
  restaurant_id: string;
  source_type: "text" | "url";
  source_url: string | null;
  status: "needs_review";
};

type ParserOutputEnvelope = {
  kind: typeof parserFallbackEnvelope;
  parserOutput: RecipeExtractionResult;
  rawText: string | null;
};

function isParserOutputEnvelope(value: unknown): value is ParserOutputEnvelope {
  if (!value || typeof value !== "object") return false;

  const envelope = value as Partial<ParserOutputEnvelope>;
  return envelope.kind === parserFallbackEnvelope && Boolean(envelope.parserOutput);
}

export function encodeParserOutputFallback(rawText: string, parserOutput: RecipeExtractionResult) {
  return JSON.stringify({
    kind: parserFallbackEnvelope,
    parserOutput,
    rawText: rawText || null,
  } satisfies ParserOutputEnvelope);
}

export function decodeParserOutputFallback(rawText: string | null) {
  if (!rawText) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawText) as unknown;
    return isParserOutputEnvelope(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function hydrateImportParserOutput(data: ImportForReview): ImportForReview {
  const envelope = decodeParserOutputFallback(data.raw_text);

  if (!envelope) {
    return data;
  }

  const currentStatus = data.parser_output?.status;
  const shouldUseEnvelope = !currentStatus || currentStatus === "placeholder";

  return {
    ...data,
    parser_output: shouldUseEnvelope ? envelope.parserOutput : data.parser_output,
    raw_text: envelope.rawText,
  };
}

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

  return data ? hydrateImportParserOutput(data as ImportForReview) : null;
}

export async function sourceUrlAlreadyExists(restaurantId: string, sourceUrl: string) {
  const supabase = await createClient();
  const { data: cookbook } = await supabase
    .from("cookbooks")
    .select("id")
    .eq("restaurant_id", restaurantId)
    .maybeSingle();

  if (!cookbook) {
    return false;
  }

  const { data } = await supabase
    .from("recipes")
    .select("id")
    .eq("cookbook_id", cookbook.id)
    .eq("source_url", sourceUrl)
    .is("archived_at", null)
    .limit(1);

  return Boolean(data?.length);
}
