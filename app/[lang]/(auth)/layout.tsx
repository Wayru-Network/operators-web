import LangSwitch from "@/lib/components/lang-switch";
import RootLayout from "@/lib/components/layout/root";
import { LayoutProps } from "@/lib/interfaces/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auth - Wayru",
  description:
    "Manage and monitor your fleet of WiFi routers. Configure, deploy, and maintain.",
};

export default async function AuthLayout({ children }: LayoutProps) {
  return (
    <RootLayout>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div className="absolute top-0 right-0 p-11">
          <LangSwitch />
        </div>
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          {children}
        </main>
      </div>
    </RootLayout>
  );
}
