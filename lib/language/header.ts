import { NextRequest } from "next/server";
import {
  SupportedLanguage,
  SupportedLanguages,
  isSupportedLanguage,
} from "./language";

export function getHeaderLanguage(request: NextRequest): SupportedLanguage {
  const acceptLanguage = request.headers.get("accept-language") || "";

  // Parse Accept-Language header: "en-US,en;q=0.9,nl;q=0.8"
  const languages = acceptLanguage
    .split(",")
    .map((lang) => {
      const [locale, q = "q=1"] = lang.trim().split(";");
      const quality = parseFloat(q.split("=")[1]) || 1;
      return { locale: locale.trim(), quality };
    })
    .sort((a, b) => b.quality - a.quality); // Sort by quality (preference)

  // Find the best matching locale
  for (const { locale } of languages) {
    // Direct match (e.g., "en-US" matches "en-US")
    if (isSupportedLanguage(locale)) {
      return locale;
    }

    // Language match (e.g., "en" from "en-US" matches "en")
    const language = locale.split("-")[0];
    if (isSupportedLanguage(language)) {
      return language;
    }

    // Region-specific match (e.g., "en-GB" should match "en-US" if no "en" exists)
    const regionMatch = SupportedLanguages.find(
      (supportedLocale) => supportedLocale.split("-")[0] === language,
    );
    if (regionMatch) {
      return regionMatch;
    }
  }

  // Fallback to first locale (default)
  return SupportedLanguages[0];
}
