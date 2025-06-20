import { SupportedLanguage } from "@/lib/language/language";

export interface PageProps {
  params: Promise<{ lang: SupportedLanguage }>;
  searchParams: { [key: string]: string | string[] | undefined };
}

export interface LayoutProps {
  params: Promise<{ lang: SupportedLanguage }>;
  children: React.ReactNode;
}
