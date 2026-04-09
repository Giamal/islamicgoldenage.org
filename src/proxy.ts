/**
 * Request proxy
 *
 * Redirects unlocalized requests to the default locale so every public page has a stable locale-prefixed URL.
 * Uses `proxy.ts` because Next.js 16 renamed the old middleware entrypoint.
 */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { defaultLocale, isLocale } from "@/i18n/config";

/**
 * Ensures the application always serves locale-prefixed routes.
 * This keeps SEO and multilingual expansion consistent from the first release.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const [, maybeLocale] = pathname.split("/");

  if (isLocale(maybeLocale)) {
    return NextResponse.next();
  }

  const localizedUrl = request.nextUrl.clone();
  localizedUrl.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;

  return NextResponse.redirect(localizedUrl);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
