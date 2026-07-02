import "server-only";

import { normalizeRecipeUrl, type RecipeExtractionResult } from "@/lib/imports/recipe-url-extractor";
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

export type SourceUrlDuplicateState = {
  pendingImportId: string | null;
  recipeTitle: string | null;
  recipeId: string | null;
  titleRecipeId: string | null;
  titleRecipeTitle: string | null;
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

function canonicalSourceUrl(sourceUrl: string) {
  try {
    return normalizeRecipeUrl(new URL(sourceUrl)).toString();
  } catch {
    return sourceUrl.trim();
  }
}

export async function getSourceUrlDuplicateState(
  restaurantId: string,
  sourceUrl: string,
  currentImportId?: string,
  recipeTitle?: string,
): Promise<SourceUrlDuplicateState> {
  const canonicalUrl = canonicalSourceUrl(sourceUrl);
  const sourceUrlCandidates = Array.from(new Set([canonicalUrl, sourceUrl.trim()].filter(Boolean)));
  const normalizedTitle = recipeTitle?.trim().toLowerCase().replace(/\s+/g, " ") ?? "";
  const supabase = await createClient();
  const { data: cookbook } = await supabase
    .from("cookbooks")
    .select("id")
    .eq("restaurant_id", restaurantId)
    .maybeSingle();

  if (!cookbook) {
    return {
      pendingImportId: null,
      recipeId: null,
      recipeTitle: null,
      titleRecipeId: null,
      titleRecipeTitle: null,
    };
  }

  const [{ data: recipes }, { data: imports }, { data: titleRecipes }] = await Promise.all([
    supabase
      .from("recipes")
      .select("id, title")
      .eq("cookbook_id", cookbook.id)
      .in("source_url", sourceUrlCandidates)
      .is("archived_at", null)
      .limit(1),
    supabase
      .from("imports")
      .select("id")
      .eq("restaurant_id", restaurantId)
      .in("source_url", sourceUrlCandidates)
      .eq("status", "needs_review")
      .is("archived_at", null)
      .neq("id", currentImportId ?? "00000000-0000-0000-0000-000000000000")
      .limit(1),
    normalizedTitle
      ? supabase
          .from("recipes")
          .select("id, title")
          .eq("cookbook_id", cookbook.id)
          .is("archived_at", null)
          .ilike("title", recipeTitle?.trim() ?? "")
          .limit(1)
      : Promise.resolve({ data: [] }),
  ]);
  const exactRecipe = recipes?.[0] ?? null;
  const titleRecipe =
    titleRecipes?.find((recipe) => recipe.id !== exactRecipe?.id) ?? titleRecipes?.[0] ?? null;

  return {
    pendingImportId: imports?.[0]?.id ?? null,
    recipeId: exactRecipe?.id ?? null,
    recipeTitle: exactRecipe?.title ?? null,
    titleRecipeId: titleRecipe?.id ?? null,
    titleRecipeTitle: titleRecipe?.title ?? null,
  };
}

export async function sourceUrlAlreadyExists(restaurantId: string, sourceUrl: string) {
  const duplicateState = await getSourceUrlDuplicateState(restaurantId, sourceUrl);
  return Boolean(duplicateState.recipeId);
}
