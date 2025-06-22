import RootLayout from "@/lib/components/layout/root";
import { LayoutProps } from "@/lib/interfaces/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Operators - Wayru",
  description:
    "Manage and monitor your fleet of WiFi routers. Configure, deploy, and maintain.",
};

export default function OperatorLayout({ children }: LayoutProps) {
  return (
    <RootLayout>
      <p>{children}</p>
    </RootLayout>
  );
}
