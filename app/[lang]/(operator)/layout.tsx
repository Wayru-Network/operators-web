import RootLayout from "@/lib/components/layout/root";
import NavMenu from "@/lib/components/navmenu";
import { LayoutProps } from "@/lib/interfaces/page";
import { Spacer } from "@heroui/spacer";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Operators - Wayru",
  description:
    "Manage and monitor your fleet of WiFi routers. Configure, deploy, and maintain.",
};

export default function OperatorLayout({ children }: LayoutProps) {
  return (
    <RootLayout>
      <div className="h-screen flex flex-row bg-[#F8FAFA] dark:bg-[#101415]">
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
        <div className="w-full p-11">{children}</div>
      </div>
    </RootLayout>
  );
}
