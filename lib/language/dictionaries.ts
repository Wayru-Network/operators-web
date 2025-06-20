import "server-only";
import { SupportedLanguage } from "./language";

const dictionaries = {
  en: () => import("@/dictionaries/en.json").then((module) => module.default),
  es: () => import("@/dictionaries/es.json").then((module) => module.default),
  pt: () => import("@/dictionaries/pt.json").then((module) => module.default),
};

export async function getDictionary(language: SupportedLanguage) {
  return dictionaries[language]();
}
