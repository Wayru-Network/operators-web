"use client";

import { useSidebar } from "../contexts/sidebar-context";

export default function SidebarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isCollapsed } = useSidebar();

  return (
    <div
      className={`relative transition-all duration-400 ease-in-out bg-[#ffffff] dark:bg-[#191c1d] ${
        isCollapsed ? "w-[100px] p-2" : "w-[306px]  p-7"
      }`}
    >
      {children}
    </div>
  );
}
