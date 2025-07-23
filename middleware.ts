import { NextRequest, NextResponse } from "next/server";
import { getHeaderLanguage } from "@/lib/language/header";
import { SupportedLanguages } from "@/lib/language/language";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/api/auth/callback") {
    return NextResponse.next();
  }

  if (pathname === "/api/portal") {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.slice(7).trim();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Check if the token matches the OPERATORS_API_KEY
    if (token !== process.env.OPERATORS_API_KEY) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    // If the token is valid, proceed with the request
    return NextResponse.next();
  }

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = SupportedLanguages.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  // e.g. incoming request is /products
  // The new URL is now /en/products
  const locale = getHeaderLanguage(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next), static files, and special paths
    "/((?!_next|favicon.ico|health|assets).*)",
    // Optional: only run on root (/) URL
    // '/'
  ],
};
