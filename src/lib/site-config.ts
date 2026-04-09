/**
 * Site configuration
 *
 * Holds cross-cutting project metadata and environment helpers.
 * Centralizing this logic avoids repeating URL assumptions across SEO and deployment-sensitive code.
 */
const fallbackSiteUrl = "https://www.islamicgoldenage.org";

/**
 * Returns the canonical public URL used for metadata and sitemap generation.
 */
export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? fallbackSiteUrl
  );
}
