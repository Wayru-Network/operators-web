import { SupportedLanguage } from "@/lib/language/language";

export interface PageProps {
  readonly params: Promise<{ lang: SupportedLanguage }>;
  readonly searchParams: { [key: string]: string | string[] | undefined };
}

export interface LayoutProps {
  readonly children: React.ReactNode;
  readonly params?: Promise<{ lang: SupportedLanguage }>;
}
