"use client";

import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ThemeProvider attribute="class">{children}</ThemeProvider>
    </HeroUIProvider>
  );
}
