import { NextRequest } from "next/server";

export const SupportedLanguages = ["en", "es", "pt"] as const;

export type SupportedLanguage = (typeof SupportedLanguages)[number];

export function isSupportedLanguage(lang: string): lang is SupportedLanguage {
  return (SupportedLanguages as readonly string[]).includes(lang);
}
