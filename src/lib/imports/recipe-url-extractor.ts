import "server-only";

import { lookup as dnsLookup } from "node:dns/promises";
import type { LookupAddress } from "node:dns";
import { request as httpRequest, type IncomingHttpHeaders } from "node:http";
import { request as httpsRequest } from "node:https";
import { isIP, type LookupFunction } from "node:net";

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

type SafeFetchResponse = {
  body: AsyncIterable<Uint8Array>;
  cancel: () => void;
  headers: IncomingHttpHeaders;
  statusCode: number;
};

export type SafeFetchDependencies = {
  lookup: (hostname: string) => Promise<LookupAddress[]>;
  request: (
    url: URL,
    address: LookupAddress,
    signal: AbortSignal,
  ) => Promise<SafeFetchResponse>;
  timeoutMs?: number;
};

const requestTimeoutMs = 10_000;
const maxRedirects = 3;
const maxResponseBytes = 2 * 1024 * 1024;
const redirectStatuses = new Set([301, 302, 303, 307, 308]);

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

export async function extractRecipeFromUrl(
  url: URL,
  dependencies: SafeFetchDependencies = defaultSafeFetchDependencies,
): Promise<RecipeExtractionResult> {
  const sourceSite = url.hostname.replace(/^www\./, "");
  const safeSourceUrl = urlWithoutCredentials(url).toString();
  const fallbackRecipe = { ...emptyRecipe, sourceSite, sourceUrl: safeSourceUrl };
  const logUrl = safeSourceUrl;

  try {
    logExtractionEvent("fetch started", {
      hostname: url.hostname,
      sourceUrl: logUrl,
    });
    const response = await fetchSafeHtml(url, dependencies);

    logExtractionEvent("fetch completed", {
      contentType: response.contentType,
      hostname: url.hostname,
      ok: true,
      status: response.status,
    });

    const html = response.html;
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
      sourceUrl: logUrl,
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

export async function fetchSafeHtml(
  url: URL,
  dependencies: SafeFetchDependencies = defaultSafeFetchDependencies,
) {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    dependencies.timeoutMs ?? requestTimeoutMs,
  );

  try {
    let currentUrl = new URL(url);

    for (let redirectCount = 0; redirectCount <= maxRedirects; redirectCount += 1) {
      const address = await validatePublicDestination(
        currentUrl,
        dependencies.lookup,
        controller.signal,
      );
      const response = await dependencies.request(currentUrl, address, controller.signal);

      if (redirectStatuses.has(response.statusCode)) {
        response.cancel();
        const location = firstHeader(response.headers.location);

        if (!location || redirectCount === maxRedirects) {
          throw new Error("Recipe URL redirected too many times");
        }

        currentUrl = new URL(location, currentUrl);
        continue;
      }

      if (response.statusCode < 200 || response.statusCode >= 300) {
        response.cancel();
        throw new Error("Recipe page request failed");
      }

      const contentType = firstHeader(response.headers["content-type"]);
      if (!contentType || !isHtmlContentType(contentType)) {
        response.cancel();
        throw new Error("Recipe page is not HTML");
      }

      const declaredLength = Number(firstHeader(response.headers["content-length"]));
      if (Number.isFinite(declaredLength) && declaredLength > maxResponseBytes) {
        response.cancel();
        throw new Error("Recipe page is too large");
      }

      return {
        contentType,
        html: await readBoundedBody(response),
        status: response.statusCode,
        url: currentUrl,
      };
    }

    throw new Error("Recipe URL redirected too many times");
  } finally {
    clearTimeout(timeout);
  }
}

async function validatePublicDestination(
  url: URL,
  lookup: SafeFetchDependencies["lookup"],
  signal: AbortSignal,
) {
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Recipe URL protocol is not allowed");
  }

  if (url.username || url.password) {
    throw new Error("Recipe URL credentials are not allowed");
  }

  const hostname = url.hostname.toLowerCase().replace(/\.$/, "").replace(/^\[|\]$/g, "");
  if (!hostname || hostname === "localhost" || hostname.endsWith(".localhost")) {
    throw new Error("Recipe URL destination is not public");
  }

  const literalFamily = isIP(hostname);
  const addresses = literalFamily
    ? [{ address: hostname, family: literalFamily as 4 | 6 }]
    : await abortable(lookup(hostname), signal);

  if (addresses.length === 0 || addresses.some((address) => !isPublicIp(address.address))) {
    throw new Error("Recipe URL destination is not public");
  }

  return addresses[0];
}

function abortable<T>(promise: Promise<T>, signal: AbortSignal) {
  if (signal.aborted) return Promise.reject(signal.reason);

  return new Promise<T>((resolve, reject) => {
    const onAbort = () => {
      cleanup();
      reject(signal.reason);
    };
    const cleanup = () => signal.removeEventListener("abort", onAbort);

    signal.addEventListener("abort", onAbort, { once: true });
    promise.then(
      (value) => {
        cleanup();
        resolve(value);
      },
      (error: unknown) => {
        cleanup();
        reject(error);
      },
    );
  });
}

function isPublicIp(address: string) {
  const family = isIP(address);
  if (family === 4) return isPublicIpv4(address);
  if (family === 6) return isPublicIpv6(address);
  return false;
}

function isPublicIpv4(address: string) {
  const octets = address.split(".").map(Number);
  if (octets.length !== 4 || octets.some((octet) => !Number.isInteger(octet) || octet < 0 || octet > 255)) {
    return false;
  }

  const value = octets.reduce((total, octet) => total * 256 + octet, 0) >>> 0;
  const inRange = (network: number, prefix: number) => {
    const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
    return (value & mask) === (network & mask);
  };

  return ![
    [0x00000000, 8],
    [0x0a000000, 8],
    [0x64400000, 10],
    [0x7f000000, 8],
    [0xa9fe0000, 16],
    [0xac100000, 12],
    [0xc0000000, 24],
    [0xc0000200, 24],
    [0xc01fc400, 24],
    [0xc034c100, 24],
    [0xc0586300, 24],
    [0xc0a80000, 16],
    [0xc0af3000, 24],
    [0xc6120000, 15],
    [0xc6336400, 24],
    [0xcb007100, 24],
    [0xe0000000, 4],
    [0xf0000000, 4],
  ].some(([network, prefix]) => inRange(network, prefix));
}

function isPublicIpv6(address: string) {
  const bytes = ipv6Bytes(address);
  if (!bytes) return false;

  const isIpv4Mapped = bytes.slice(0, 10).every((byte) => byte === 0) && bytes[10] === 0xff && bytes[11] === 0xff;
  if (isIpv4Mapped) {
    return isPublicIpv4(bytes.slice(12).join("."));
  }

  const isGlobalUnicast = (bytes[0] & 0xe0) === 0x20;
  const isProtocolAssignment = bytes[0] === 0x20 && bytes[1] === 0x01 && (bytes[2] & 0xfe) === 0;
  const isDocumentation = bytes[0] === 0x20 && bytes[1] === 0x01 && bytes[2] === 0x0d && bytes[3] === 0xb8;
  const isSixToFour = bytes[0] === 0x20 && bytes[1] === 0x02;
  const isExtendedDocumentation = bytes[0] === 0x3f && (bytes[1] & 0xf0) === 0xf0;

  return isGlobalUnicast
    && !isProtocolAssignment
    && !isDocumentation
    && !isSixToFour
    && !isExtendedDocumentation;
}

function ipv6Bytes(address: string) {
  const withoutZone = address.split("%")[0].toLowerCase();
  const [left = "", right = ""] = withoutZone.split("::");
  if (withoutZone.split("::").length > 2) return null;

  const parsePart = (part: string) => part ? part.split(":").filter(Boolean) : [];
  const leftParts = parsePart(left);
  const rightParts = parsePart(right);
  const missing = 8 - leftParts.length - rightParts.length;
  const parts = withoutZone.includes("::")
    ? [...leftParts, ...Array(Math.max(missing, 0)).fill("0"), ...rightParts]
    : leftParts;

  if (parts.length !== 8 || parts.some((part) => !/^[0-9a-f]{1,4}$/.test(part))) return null;

  return parts.flatMap((part) => {
    const value = Number.parseInt(part, 16);
    return [value >> 8, value & 0xff];
  });
}

function isHtmlContentType(contentType: string) {
  const mediaType = contentType.split(";", 1)[0].trim().toLowerCase();
  return mediaType === "text/html" || mediaType === "application/xhtml+xml";
}

async function readBoundedBody(response: SafeFetchResponse) {
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  for await (const chunk of response.body) {
    totalBytes += chunk.byteLength;
    if (totalBytes > maxResponseBytes) {
      response.cancel();
      throw new Error("Recipe page is too large");
    }
    chunks.push(chunk);
  }

  const joined = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    joined.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(joined);
}

function firstHeader(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function urlWithoutCredentials(url: URL) {
  const sanitized = new URL(url);
  sanitized.username = "";
  sanitized.password = "";
  return sanitized;
}

async function lookupAddresses(hostname: string) {
  return dnsLookup(hostname, { all: true, verbatim: true });
}

export function createPinnedRequestOptions(address: LookupAddress, signal: AbortSignal) {
  const pinnedLookup: LookupFunction = (_hostname, options, callback) => {
    if (typeof options === "object" && options.all) {
      callback(null, [address]);
      return;
    }
    callback(null, address.address, address.family);
  };

  return {
    agent: false as const,
    headers: {
      accept: "text/html,application/xhtml+xml",
      "user-agent": "BigAlRecipeImporter/1.0",
    },
    lookup: pinnedLookup,
    signal,
  };
}

function requestPinned(url: URL, address: LookupAddress, signal: AbortSignal) {
  return new Promise<SafeFetchResponse>((resolve, reject) => {
    const request = (url.protocol === "https:" ? httpsRequest : httpRequest)(
      url,
      createPinnedRequestOptions(address, signal),
      (response) => {
        resolve({
          body: response,
          cancel: () => response.destroy(),
          headers: response.headers,
          statusCode: response.statusCode ?? 0,
        });
      },
    );
    request.on("error", reject);
    request.end();
  });
}

const defaultSafeFetchDependencies: SafeFetchDependencies = {
  lookup: lookupAddresses,
  request: requestPinned,
};

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
