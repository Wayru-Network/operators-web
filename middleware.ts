import { NextRequest, NextResponse } from "next/server";
import { getHeaderLanguage } from "@/lib/language/header";
import { SupportedLanguages } from "@/lib/language/language";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = SupportedLanguages.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
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
