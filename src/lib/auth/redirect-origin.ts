type AuthRedirectOriginInput = {
  configuredSiteUrl?: string;
  forwardedHost?: string | null;
  forwardedProto?: string | null;
  requestOrigin?: string | null;
};

function safeOrigin(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);

    if ((url.protocol !== "http:" && url.protocol !== "https:") || url.username || url.password) {
      return null;
    }

    return url.origin;
  } catch {
    return null;
  }
}

export function resolveAuthRedirectOrigin({
  configuredSiteUrl,
  forwardedHost,
  forwardedProto,
  requestOrigin,
}: AuthRedirectOriginInput) {
  const configuredOrigin = safeOrigin(configuredSiteUrl);

  if (configuredOrigin) {
    return configuredOrigin;
  }

  const host = forwardedHost?.split(",")[0]?.trim();
  const protocol = forwardedProto?.split(",")[0]?.trim();
  const forwardedOrigin = host && protocol ? safeOrigin(`${protocol}://${host}`) : null;

  if (forwardedOrigin) {
    return forwardedOrigin;
  }

  return safeOrigin(requestOrigin) ?? "http://localhost:3000";
}
