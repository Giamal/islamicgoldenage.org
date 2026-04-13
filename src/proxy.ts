/**
 * Request proxy
 *
 * Redirects unlocalized requests to the default locale so every public page has a stable locale-prefixed URL.
 * Also protects the private /admin area with HTTP Basic Auth for the initial solo-founder workflow.
 * Uses `proxy.ts` because Next.js 16 renamed the old middleware entrypoint.
 */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { defaultLocale, isLocale } from "@/i18n/config";

function unauthorizedAdminResponse() {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Admin Area"',
    },
  });
}

function parseBasicAuth(authorization: string) {
  if (!authorization.startsWith("Basic ")) {
    return null;
  }

  try {
    const encoded = authorization.slice("Basic ".length).trim();
    const decoded = atob(encoded);
    const separatorIndex = decoded.indexOf(":");

    if (separatorIndex < 0) {
      return null;
    }

    return {
      username: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1),
    };
  } catch {
    return null;
  }
}

function isAuthorizedAdminRequest(request: NextRequest) {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    return false;
  }

  const parsed = parseBasicAuth(request.headers.get("authorization") ?? "");
  if (!parsed) {
    return false;
  }

  return parsed.username === username && parsed.password === password;
}

/**
 * Ensures the application always serves locale-prefixed routes.
 * This keeps SEO and multilingual expansion consistent from the first release.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!isAuthorizedAdminRequest(request)) {
      return unauthorizedAdminResponse();
    }

    return NextResponse.next();
  }

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
