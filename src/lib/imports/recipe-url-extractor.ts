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
  status: "failed" | "placeholder" | "success";
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
    return url;
  } catch {
    return null;
  }
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
      return {
        message: "Big Al could not find recipe data on this page. The link is saved, and you can still add the recipe details below.",
        recipe: fallbackRecipe,
        status: "failed",
      };
    }

    const recipe = normalizeRecipe(recipeJson, fallbackRecipe);
    const hasCoreRecipe = recipe.title && recipe.ingredients.length > 0 && recipe.instructions.length > 0;

    logExtractionEvent("recipe json-ld normalized", {
      author: recipe.author,
      hasCoreRecipe: Boolean(hasCoreRecipe),
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
      status: hasCoreRecipe ? "success" : "failed",
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

  for (const script of scripts) {
    const rawJson = decodeHtmlEntities(stripHtmlComments(script[1] ?? "").trim());
    if (!rawJson) continue;

    try {
      const parsed = JSON.parse(rawJson) as JsonValue;
      const recipe = findRecipeObject(parsed);
      if (recipe) return recipe;
    } catch (error) {
      logExtractionWarning("json-ld parse failed", {
        errorMessage: error instanceof Error ? error.message : String(error),
        rawJsonLength: rawJson.length,
      });
      continue;
    }
  }

  return null;
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

function findRecipeObject(value: JsonValue): JsonObject | null {
  if (Array.isArray(value)) {
    for (const item of value) {
      const recipe = findRecipeObject(item);
      if (recipe) return recipe;
    }
    return null;
  }

  if (!isObject(value)) return null;

  if (isRecipeType(value["@type"])) {
    return value;
  }

  const graph = value["@graph"];
  if (Array.isArray(graph)) {
    return findRecipeObject(graph);
  }

  for (const nestedKey of ["mainEntity", "mainEntityOfPage", "about"]) {
    const nested = value[nestedKey];
    const recipe = findRecipeObject(nested);
    if (recipe) return recipe;
  }

  return null;
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
    author: getName(recipeJson.author) || getName(recipeJson.creator),
    cookMinutes: parseDuration(recipeJson.cookTime),
    description: textValue(recipeJson.description),
    imageUrl: imageValue(recipeJson.image),
    ingredients: stringArray(recipeJson.recipeIngredient ?? recipeJson.ingredients),
    instructions: instructionArray(recipeJson.recipeInstructions),
    prepMinutes: parseDuration(recipeJson.prepTime),
    title: textValue(recipeJson.name),
    totalMinutes: parseDuration(recipeJson.totalTime),
    yield: yieldValue(recipeJson.recipeYield ?? recipeJson.yield),
  };
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
