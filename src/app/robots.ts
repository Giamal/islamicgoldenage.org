/**
 * Robots configuration
 *
 * Exposes a simple crawl policy plus the sitemap location.
 * Keeping this in code makes environment-specific site URLs straightforward.
 */
import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site-config";

/**
 * Returns the robots rules used by search engines for this public site.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
