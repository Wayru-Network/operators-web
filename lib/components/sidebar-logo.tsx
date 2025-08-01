"use client";
import Image from "next/image";
import { useSidebar } from "../contexts/sidebar-context";

export default function SidebarLogo() {
  const { isCollapsed } = useSidebar();

  return (
    <div>
      <div
        className={
          isCollapsed
            ? "flex flex-col justify-center items-center mt-5"
            : "flex flex-row justify-center items-center"
        }
      >
        {isCollapsed ? (
          <Image
            className="dark:invert"
            src="/assets/logo-iso.webp"
            alt="Wayru logo"
            width={42}
            height={12}
          />
        ) : (
          <Image
            className="dark:invert"
            src="/assets/logo.webp"
            alt="Wayru logo"
            width={131}
            height={42}
          />
        )}

        <p
          className={
            isCollapsed
              ? "text-[10px] font-medium -mb-0.5 ml-2 text-center text-[#838383] w-full mt-1"
              : "text-[10px] font-medium -mb-0.5 self-end ml-2 text-[#838383]"
          }
        >
          v.01
        </p>
      </div>
    </div>
  );
}
