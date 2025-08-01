"use client";
import Image from "next/image";
import { useSidebar } from "../contexts/sidebar-context";
import { ChevronFirst, ChevronLast } from "lucide-react";

export default function SidebarLogo() {
  const { toggleSidebar, isCollapsed } = useSidebar();

  return (
    <div>
      <div className="flex flex-row justify-end items-center align-end ">
        {isCollapsed ? (
          <ChevronLast
            size={20}
            onClick={toggleSidebar}
            className="cursor-pointer"
          />
        ) : (
          <ChevronFirst
            size={20}
            onClick={toggleSidebar}
            className="cursor-pointer"
          />
        )}
      </div>
      <div className="flex flex-row justify-center align-end">
        <Image
          className="dark:invert"
          src="/assets/logo.webp"
          alt="Wayru logo"
          width={isCollapsed ? 70 : 131}
          height={isCollapsed ? 20 : 42}
        />
        <p className="text-[10px] font-medium -mb-0.5 self-end ml-2 text-[#838383]">
          v.01
        </p>
      </div>
    </div>
  );
}
