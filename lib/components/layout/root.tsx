import "./globals.css";
import { Providers } from "@/lib/components/layout/providers";
import { LayoutProps } from "@/lib/interfaces/page";
import { GeistMono, GeistSans } from "@/lib/ui/font";
import CheckSupportedDeviceLayout from "./supported-device-layout";

export default async function RootLayout({ children, params }: LayoutProps) {
  return (
    <html lang={(await params)?.lang??'en'} suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        <Providers>
          <CheckSupportedDeviceLayout>{children}</CheckSupportedDeviceLayout>
        </Providers>
      </body>
    </html>
  );
}
