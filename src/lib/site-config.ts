/**
 * Site configuration
 *
 * Holds cross-cutting project metadata and environment helpers.
 * Centralizing this logic avoids repeating URL assumptions across SEO and deployment-sensitive code.
 */
const fallbackSiteUrl = "https://islamicgoldenage.org";

function normalizeCanonicalSiteUrl(siteUrl: string) {
  const trimmed = siteUrl.replace(/\/$/, "");

  try {
    const url = new URL(trimmed);
    if (url.hostname.startsWith("www.")) {
      url.hostname = url.hostname.slice(4);
    }
    return url.origin;
  } catch {
    return trimmed.replace(/^https?:\/\/www\./i, "https://");
  }
}

/**
 * Returns the canonical public URL used for metadata and sitemap generation.
 */
export function getSiteUrl() {
  return normalizeCanonicalSiteUrl(
    process.env.NEXT_PUBLIC_SITE_URL ?? fallbackSiteUrl,
  );
}
