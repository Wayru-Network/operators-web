import ConnectWallet from "@/lib/components/connect-wallet";
import LangSwitch from "@/lib/components/lang-switch";
import RootLayout from "@/lib/components/layout/root";
import NavMenu from "@/lib/components/navmenu";
import { LayoutProps } from "@/lib/interfaces/page";
import { Spacer } from "@heroui/spacer";
import { Metadata } from "next";
import Image from "next/image";
import { verifySession } from "@/lib/dal/dal";
import { ToastProvider } from "@heroui/toast";

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
      <div className="min-h-screen flex flex-row bg-[#F8FAFA] dark:bg-[#101415]">
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
        <div className="w-full p-11">
          <div className="flex flex-row gap-x-4 justify-end mb-10">
            <ConnectWallet />
            <LangSwitch />
          </div>
          {children}
        </div>
      </div>
    </RootLayout>
  );
}
