import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/components/layout/providers";
import { LayoutProps } from "@/lib/interfaces/page";
import { GeistMono, GeistSans } from "@/lib/ui/font";

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
