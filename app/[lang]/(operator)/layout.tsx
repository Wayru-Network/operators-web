import WalletStatus from "@/lib/components/wallet-status";
import LangSwitch from "@/lib/components/lang-switch";
import RootLayout from "@/lib/components/layout/root";
import NavMenu from "@/lib/components/navmenu";
import { LayoutProps } from "@/lib/interfaces/page";
import { Spacer } from "@heroui/spacer";
import { Metadata } from "next";
import Image from "next/image";
import { verifySession } from "@/lib/dal/dal";
import { ToastProvider } from "@heroui/toast";
import LogoutButton from "@/lib/components/logout";
import ThemeSwitcher from "@/lib/components/theme-switcher";
import ScrollContainer from "@/lib/components/scroll-container";
import StickyHeader from "@/lib/components/sticky-header";

export const metadata: Metadata = {
  title: "Operators - Wayru",
  description:
    "Manage and monitor your fleet of WiFi routers. Configure, deploy, and maintain.",
};

export default async function OperatorLayout({ children }: LayoutProps) {
  void (await verifySession());

  return (
    <RootLayout>
      <ToastProvider
        placement="bottom-center"
        toastProps={{
          classNames: {
            base: "border-none",
          },
        }}
      />
      <div className="h-screen flex flex-row bg-[#F8FAFA] dark:bg-[#101415]">
        {/* Sidebar */}
        <div className="w-[306px] p-7 bg-[#ffffff] dark:bg-[#191c1d]">
          <div className="flex flex-row justify-center align-end">
            <Image
              className="dark:invert"
              src="/assets/logo.webp"
              alt="Wayru logo"
              width={131}
              height={42}
            />
            <p className="text-[10px] font-medium -mb-0.5 self-end ml-2 text-[#838383]">
              v.01
            </p>
          </div>
          <Spacer y={12} />
          <NavMenu />
        </div>
        {/* header and page content */}
        <ScrollContainer>
          {/* Header */}
          <StickyHeader>
            <WalletStatus />
            <LangSwitch />
            <ThemeSwitcher />
            <LogoutButton />
          </StickyHeader>
          {/* Page Content */}
          {children}
        </ScrollContainer>
      </div>
    </RootLayout>
  );
}
