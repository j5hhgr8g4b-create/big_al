import "server-only";

export type ExtractedRecipe = {
  author: string;
  cookMinutes: number | null;
  description: string;
  imageUrl: string;
  ingredients: string[];
  instructions: string[];
  prepMinutes: number | null;
  sourceSite: string;
  sourceUrl: string;
  title: string;
  totalMinutes: number | null;
  yield: string;
};

export type RecipeExtractionResult = {
  message: string;
  recipe: ExtractedRecipe;
  status: "failed" | "partial" | "placeholder" | "success";
};

type JsonValue =
  | JsonValue[]
  | boolean
  | null
  | number
  | string
  | { [key: string]: JsonValue };

type JsonObject = { [key: string]: JsonValue };

const emptyRecipe: ExtractedRecipe = {
  author: "",
  cookMinutes: null,
  description: "",
  imageUrl: "",
  ingredients: [],
  instructions: [],
  prepMinutes: null,
  sourceSite: "",
  sourceUrl: "",
  title: "",
  totalMinutes: null,
  yield: "",
};

export function validateRecipeUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }
    return normalizeRecipeUrl(url);
  } catch {
    return null;
  }
}

export function normalizeRecipeUrl(url: URL) {
  const normalized = new URL(url.toString());
  normalized.hash = "";

  for (const param of [
    "fbclid",
    "gclid",
    "mc_cid",
    "mc_eid",
    "utm_campaign",
    "utm_content",
    "utm_medium",
    "utm_source",
    "utm_term",
  ]) {
    normalized.searchParams.delete(param);
  }

  normalized.hostname = normalized.hostname.toLowerCase();
  return normalized;
}

export async function extractRecipeFromUrl(url: URL): Promise<RecipeExtractionResult> {
  const sourceSite = url.hostname.replace(/^www\./, "");
  const fallbackRecipe = { ...emptyRecipe, sourceSite, sourceUrl: url.toString() };

  try {
    logExtractionEvent("fetch started", {
      hostname: url.hostname,
      sourceUrl: url.toString(),
    });
    const response = await fetchWithTimeout(url);

    logExtractionEvent("fetch completed", {
      contentType: response.headers.get("content-type"),
      hostname: url.hostname,
      ok: response.ok,
      status: response.status,
    });

    if (!response.ok) {
      return {
        message: "Big Al could not read this one automatically. The link is saved, and you can still add the recipe details below.",
        recipe: fallbackRecipe,
        status: "failed",
      };
    }

    const html = await response.text();
    const recipeJson = findRecipeJson(html);

    if (!recipeJson) {
      logExtractionEvent("recipe json-ld not found", {
        hostname: url.hostname,
        htmlLength: html.length,
        jsonLdScriptCount: countJsonLdScripts(html),
      });
      const fallbackFromPage = mergeRecipeFallback(fallbackRecipe, readPageFallback(html));

      return {
        message: fallbackFromPage.title
          ? "Big Al could not find structured recipe data, but it saved basic page details for review."
          : "Big Al could not find recipe data on this page. The link is saved, and you can still add the recipe details below.",
        recipe: fallbackFromPage,
        status: fallbackFromPage.title ? "partial" : "failed",
      };
    }

    const recipe = normalizeRecipe(recipeJson, mergeRecipeFallback(fallbackRecipe, readPageFallback(html)));
    const hasCoreRecipe = recipe.title && recipe.ingredients.length > 0 && recipe.instructions.length > 0;
    const hasUsefulRecipe =
      recipe.title || recipe.description || recipe.imageUrl || recipe.author || recipe.ingredients.length > 0 || recipe.instructions.length > 0;

    logExtractionEvent("recipe json-ld normalized", {
      author: recipe.author,
      hasCoreRecipe: Boolean(hasCoreRecipe),
      hasUsefulRecipe: Boolean(hasUsefulRecipe),
      hostname: url.hostname,
      ingredientCount: recipe.ingredients.length,
      instructionCount: recipe.instructions.length,
      title: recipe.title,
    });

    return {
      message: hasCoreRecipe
        ? "Big Al found structured recipe details on the page."
        : "Big Al found some recipe details, but this one still needs a careful check.",
      recipe,
      status: hasCoreRecipe ? "success" : hasUsefulRecipe ? "partial" : "failed",
    };
  } catch (error) {
    logExtractionWarning("fetch or extraction threw", {
      errorName: error instanceof Error ? error.name : "UnknownError",
      errorMessage: error instanceof Error ? error.message : String(error),
      hostname: url.hostname,
      sourceUrl: url.toString(),
    });
    return {
      message: "Big Al could not read this one automatically. The link is saved, and you can still add the recipe details below.",
      recipe: fallbackRecipe,
      status: "failed",
    };
  }
}

function logExtractionEvent(message: string, details: Record<string, unknown>) {
  console.info(`[recipe-extractor] ${message}`, details);
}

function logExtractionWarning(message: string, details: Record<string, unknown>) {
  console.warn(`[recipe-extractor] ${message}`, details);
}

async function fetchWithTimeout(url: URL) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    return await fetch(url, {
      headers: {
        accept: "text/html,application/xhtml+xml",
        "user-agent": "BigAlRecipeImporter/1.0",
      },
      redirect: "follow",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

function findRecipeJson(html: string) {
  const scripts = html.matchAll(
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  );
  let bestRecipe: JsonObject | null = null;
  let bestScore = -1;

  for (const script of scripts) {
    const rawJson = decodeHtmlEntities(stripHtmlComments(script[1] ?? "").trim());
    if (!rawJson) continue;

    try {
      const parsed = JSON.parse(rawJson) as JsonValue;
      for (const recipe of findRecipeObjects(parsed)) {
        const score = recipeScore(recipe);
        if (score > bestScore) {
          bestRecipe = recipe;
          bestScore = score;
        }
      }
    } catch (error) {
      logExtractionWarning("json-ld parse failed", {
        errorMessage: error instanceof Error ? error.message : String(error),
        rawJsonLength: rawJson.length,
      });
      continue;
    }
  }

  return bestRecipe;
}

function countJsonLdScripts(html: string) {
  return Array.from(
    html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>/gi),
  ).length;
}

function stripHtmlComments(value: string) {
  return value.replace(/^<!--/, "").replace(/-->$/, "");
}

function decodeHtmlEntities(value: string) {
  return value
    .replaceAll("&quot;", "\"")
    .replaceAll("&amp;", "&")
    .replaceAll("&#34;", "\"")
    .replaceAll("&#39;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function findRecipeObjects(value: JsonValue | undefined): JsonObject[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) => findRecipeObjects(item));
  }

  if (!isObject(value)) return [];

  const recipes: JsonObject[] = [];

  if (isRecipeType(value["@type"])) {
    recipes.push(value);
  }

  for (const nestedKey of ["@graph", "about", "hasPart", "itemListElement", "mainEntity", "mainEntityOfPage", "subjectOf"]) {
    const nested = value[nestedKey];
    recipes.push(...findRecipeObjects(nested));
  }

  return recipes;
}

function recipeScore(recipe: JsonObject) {
  return [
    recipe.name,
    recipe.author,
    recipe.creator,
    recipe.description,
    recipe.image,
    recipe.recipeIngredient ?? recipe.ingredients,
    recipe.recipeInstructions,
    recipe.totalTime,
    recipe.recipeYield ?? recipe.yield,
  ].filter(Boolean).length;
}

function isRecipeType(value: JsonValue | undefined) {
  if (typeof value === "string") {
    return value.toLowerCase() === "recipe";
  }

  return Array.isArray(value) && value.some((item) => typeof item === "string" && item.toLowerCase() === "recipe");
}

function normalizeRecipe(recipeJson: JsonObject, fallback: ExtractedRecipe): ExtractedRecipe {
  return {
    ...fallback,
    author: getName(recipeJson.author) || getName(recipeJson.creator) || fallback.author,
    cookMinutes: parseDuration(recipeJson.cookTime) ?? fallback.cookMinutes,
    description: textValue(recipeJson.description) || fallback.description,
    imageUrl: imageValue(recipeJson.image) || fallback.imageUrl,
    ingredients: stringArray(recipeJson.recipeIngredient ?? recipeJson.ingredients),
    instructions: instructionArray(recipeJson.recipeInstructions),
    prepMinutes: parseDuration(recipeJson.prepTime) ?? fallback.prepMinutes,
    sourceSite: textValue(recipeJson.publisher) || fallback.sourceSite,
    title: textValue(recipeJson.name) || fallback.title,
    totalMinutes: parseDuration(recipeJson.totalTime) ?? fallback.totalMinutes,
    yield: yieldValue(recipeJson.recipeYield ?? recipeJson.yield) || fallback.yield,
  };
}

function readPageFallback(html: string): ExtractedRecipe {
  return {
    ...emptyRecipe,
    author: metaContent(html, "author"),
    description: metaContent(html, "description") || metaPropertyContent(html, "og:description"),
    imageUrl: metaPropertyContent(html, "og:image"),
    sourceSite: metaPropertyContent(html, "og:site_name"),
    title:
      metaPropertyContent(html, "og:title") ||
      titleTagContent(html),
  };
}

function mergeRecipeFallback(base: ExtractedRecipe, fallback: ExtractedRecipe): ExtractedRecipe {
  return {
    ...base,
    author: fallback.author || base.author,
    description: fallback.description || base.description,
    imageUrl: fallback.imageUrl || base.imageUrl,
    sourceSite: fallback.sourceSite || base.sourceSite,
    title: fallback.title || base.title,
  };
}

function metaContent(html: string, name: string) {
  const pattern = new RegExp(`<meta\\b(?=[^>]*\\bname=["']${escapeRegExp(name)}["'])(?=[^>]*\\bcontent=["']([^"']*)["'])[^>]*>`, "i");
  return cleanText(pattern.exec(html)?.[1] ?? "");
}

function metaPropertyContent(html: string, property: string) {
  const pattern = new RegExp(`<meta\\b(?=[^>]*\\bproperty=["']${escapeRegExp(property)}["'])(?=[^>]*\\bcontent=["']([^"']*)["'])[^>]*>`, "i");
  return cleanText(pattern.exec(html)?.[1] ?? "");
}

function titleTagContent(html: string) {
  return cleanText(/<title\b[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1] ?? "");
}

function instructionArray(value: JsonValue | undefined): string[] {
  if (typeof value === "string") {
    return splitInstructionText(value);
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (typeof item === "string") {
      return splitInstructionText(item);
    }

    if (!isObject(item)) {
      return [];
    }

    const nested = item.itemListElement;
    if (Array.isArray(nested)) {
      return instructionArray(nested);
    }

    return textValue(item.text ?? item.name);
  }).filter(Boolean);
}

function splitInstructionText(value: string) {
  return cleanText(value)
    .split(/\n+|\r+|(?:^|\s)(?:\d+[\).]\s+)/)
    .map(cleanText)
    .filter(Boolean);
}

function stringArray(value: JsonValue | undefined): string[] {
  if (typeof value === "string") {
    return [cleanText(value)].filter(Boolean);
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => textValue(item)).filter(Boolean);
}

function imageValue(value: JsonValue | undefined): string {
  if (typeof value === "string") return value;

  if (Array.isArray(value)) {
    const first = value.map(imageValue).find(Boolean);
    return first ?? "";
  }

  if (isObject(value)) {
    return textValue(value.url ?? value.contentUrl);
  }

  return "";
}

function yieldValue(value: JsonValue | undefined): string {
  if (Array.isArray(value)) {
    return value.map((item) => textValue(item)).filter(Boolean).join(", ");
  }

  return textValue(value);
}

function getName(value: JsonValue | undefined): string {
  if (typeof value === "string") return cleanText(value);

  if (Array.isArray(value)) {
    return value.map(getName).filter(Boolean).join(", ");
  }

  if (isObject(value)) {
    return textValue(value.name);
  }

  return "";
}

function textValue(value: JsonValue | undefined): string {
  if (typeof value === "string" || typeof value === "number") {
    return cleanText(String(value));
  }

  if (isObject(value)) {
    return textValue(value.text ?? value.name);
  }

  return "";
}

function cleanText(value: string) {
  return decodeHtmlEntities(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseDuration(value: JsonValue | undefined): number | null {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const duration = String(value).trim();
  if (!duration) return null;

  const isoMatch = duration.match(/^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?/i);
  if (isoMatch && isoMatch[0].length > 1) {
    const days = Number(isoMatch[1] ?? 0);
    const hours = Number(isoMatch[2] ?? 0);
    const minutes = Number(isoMatch[3] ?? 0);
    return days * 1440 + hours * 60 + minutes;
  }

  const hours = duration.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h)\b/i);
  const minutes = duration.match(/(\d+(?:\.\d+)?)\s*(?:minutes?|mins?|m)\b/i);
  const total = Number(hours?.[1] ?? 0) * 60 + Number(minutes?.[1] ?? 0);

  if (total > 0) return Math.round(total);

  const numeric = Number(duration);
  return Number.isFinite(numeric) && numeric >= 0 ? Math.round(numeric) : null;
}

function isObject(value: JsonValue | undefined): value is JsonObject {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
