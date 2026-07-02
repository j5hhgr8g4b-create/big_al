"use server";

import { randomUUID } from "node:crypto";

import { redirect } from "next/navigation";

import {
  extractRecipeFromUrl,
  validateRecipeUrl,
  type RecipeExtractionResult,
} from "@/lib/imports/recipe-url-extractor";
import { encodeParserOutputFallback } from "@/lib/imports/get-import";
import { createClient } from "@/lib/supabase/server";

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function errorRedirect(message: string): never {
  redirect(`/cookbook/imports/new?${new URLSearchParams({ error: message }).toString()}`);
}

function logImportEvent(message: string, details: Record<string, unknown>) {
  console.info(`[recipe-import] ${message}`, details);
}

function logImportWarning(message: string, details: Record<string, unknown>) {
  console.warn(`[recipe-import] ${message}`, details);
}

export async function createImport(formData: FormData) {
  const importId = randomUUID();
  const restaurantId = field(formData, "restaurantId");
  const sourceUrl = field(formData, "sourceUrl");
  const rawText = field(formData, "rawText");
  let normalizedSourceUrl = sourceUrl;
  let parserName = "manual-placeholder-v1";
  let parserOutput: RecipeExtractionResult = {
    message: "Automatic parsing is not enabled. Review and structure this Import manually.",
    recipe: {
      author: "",
      cookMinutes: null,
      description: "",
      imageUrl: "",
      ingredients: [],
      instructions: [],
      prepMinutes: null,
      sourceSite: "",
      sourceUrl: sourceUrl,
      title: "",
      totalMinutes: null,
      yield: "",
    },
    status: "placeholder",
  };

  logImportEvent("submission received", {
    hasRawText: Boolean(rawText),
    hasRestaurantId: Boolean(restaurantId),
    hasSourceUrl: Boolean(sourceUrl),
    importId,
    sourceUrl,
  });

  if (!restaurantId || (!sourceUrl && !rawText)) {
    logImportWarning("submission rejected before save", {
      hasRawText: Boolean(rawText),
      hasRestaurantId: Boolean(restaurantId),
      hasSourceUrl: Boolean(sourceUrl),
      importId,
    });
    errorRedirect("Paste a recipe link, or add recipe text as a fallback.");
  }

  if (sourceUrl) {
    const url = validateRecipeUrl(sourceUrl);

    if (!url) {
      logImportWarning("url validation failed", { importId, sourceUrl });
      errorRedirect("Enter a recipe link that starts with http or https.");
    }

    if (url.toString().length > 2000) {
      logImportWarning("submission rejected for normalized url length", {
        importId,
        sourceUrlLength: url.toString().length,
      });
      errorRedirect("The imported recipe link is too long.");
    }

    logImportEvent("url validation passed", {
      hostname: url.hostname,
      importId,
      sourceUrl: url.toString(),
    });

    normalizedSourceUrl = url.toString();
    parserName = "schema-org-recipe-jsonld-v1";
    parserOutput = await extractRecipeFromUrl(url);
    parserOutput = {
      ...parserOutput,
      recipe: {
        ...parserOutput.recipe,
        sourceUrl: url.toString(),
      },
    };

    logImportEvent("extraction finished", {
      importId,
      ingredientCount: parserOutput.recipe.ingredients.length,
      instructionCount: parserOutput.recipe.instructions.length,
      parserName,
      status: parserOutput.status,
      title: parserOutput.recipe.title,
    });
  }

  if (normalizedSourceUrl.length > 2000 || rawText.length > 100000) {
    logImportWarning("submission rejected for length", {
      importId,
      rawTextLength: rawText.length,
      sourceUrlLength: normalizedSourceUrl.length,
    });
    errorRedirect("The imported content is too long.");
  }

  const supabase = await createClient();
  logImportEvent("saving import with parser output", {
    importId,
    parserName,
    parserOutputKeys: Object.keys(parserOutput),
    parserRecipeKeys: Object.keys(parserOutput.recipe),
    parserStatus: parserOutput.status,
  });

  const { error } = await supabase.rpc("create_import", {
    target_import_id: importId,
    target_restaurant_id: restaurantId,
    import_source_url: normalizedSourceUrl,
    import_raw_text: rawText,
    import_parser_name: parserName,
    import_parser_output: parserOutput,
  });

  if (error) {
    logImportWarning("parser-output save failed; trying legacy import save", {
      code: error.code,
      details: error.details,
      hint: error.hint,
      importId,
      message: error.message,
    });
    let legacyRawText =
      parserOutput.status === "placeholder"
        ? rawText
        : encodeParserOutputFallback(rawText, parserOutput);

    if (legacyRawText.length > 100000) {
      logImportWarning("legacy parser-output envelope too large; preserving original raw text", {
        importId,
        legacyRawTextLength: legacyRawText.length,
      });
      legacyRawText = rawText;
    }

    logImportEvent("legacy import save prepared", {
      hasExtractedParserOutput: parserOutput.status !== "placeholder",
      importId,
      legacyRawTextLength: legacyRawText.length,
      parserStatus: parserOutput.status,
    });

    const fallbackResult = await supabase.rpc("create_import", {
      target_import_id: importId,
      target_restaurant_id: restaurantId,
      import_source_url: normalizedSourceUrl,
      import_raw_text: legacyRawText,
    });

    if (fallbackResult.error) {
      logImportWarning("legacy import save failed", {
        code: fallbackResult.error.code,
        details: fallbackResult.error.details,
        hint: fallbackResult.error.hint,
        importId,
        message: fallbackResult.error.message,
      });
      errorRedirect("We could not save this Import. Please try again.");
    }

    logImportEvent("legacy import save succeeded", {
      importId,
      reason: "parser-output save failed",
    });
  } else {
    logImportEvent("parser-output save succeeded", { importId });
  }

  logImportEvent("redirecting to review", { importId });
  redirect(`/cookbook/imports/${importId}/review`);
}

export async function discardImport(formData: FormData) {
  const importId = field(formData, "importId");

  if (!importId) {
    redirect("/cookbook");
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("discard_import", { target_import_id: importId });

  if (error) {
    logImportWarning("discard import failed", {
      code: error.code,
      details: error.details,
      hint: error.hint,
      importId,
      message: error.message,
    });
    redirect(
      `/cookbook/imports/${importId}/review?${new URLSearchParams({
        error: "Big Al could not discard this import. Try again.",
      }).toString()}`,
    );
  }

  redirect("/cookbook");
}
