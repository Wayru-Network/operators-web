import WalletStatus from "@/lib/components/wallet-status";
import LangSwitch from "@/lib/components/lang-switch";
import RootLayout from "@/lib/components/layout/root";
import NavMenu from "@/lib/components/navmenu";
import { LayoutProps } from "@/lib/interfaces/page";
import { Spacer } from "@heroui/spacer";
import { Metadata } from "next";
import { verifySession } from "@/lib/dal/dal";
import { ToastProvider } from "@heroui/toast";
import LogoutButton from "@/lib/components/logout";
import ThemeSwitcher from "@/lib/components/theme-switcher";
import ScrollContainer from "@/lib/components/scroll-container";
import StickyHeader from "@/lib/components/sticky-header";
import { SidebarProvider } from "@/lib/contexts/sidebar-context";
import SidebarLogo from "@/lib/components/sidebar-logo";
import SidebarWrapper from "@/lib/components/sidebar-wrapper";
import ToggleSidebar from "@/lib/components/toggle-sidebar";

export const metadata: Metadata = {
  title: "Operators - Wayru",
  description:
    "Manage and monitor your fleet of WiFi routers. Configure, deploy, and maintain.",
};

export default async function OperatorLayout({ children }: LayoutProps) {
  const session = await verifySession();
  const isCollapsed = session.isCollapsed;

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
      <SidebarProvider initialIsCollapsed={isCollapsed}>
        <div className="h-screen flex flex-row bg-[#F8FAFA] dark:bg-[#101415]">
          {/* Sidebar */}
          <SidebarWrapper>
            <SidebarLogo />
            <Spacer y={12} />
            <NavMenu />
            <ToggleSidebar />
          </SidebarWrapper>
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
      </SidebarProvider>
    </RootLayout>
  );
}
