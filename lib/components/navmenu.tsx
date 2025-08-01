"use client";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  CircleGauge,
  Router,
  SatelliteDish,
  Cog,
  LucideProps,
} from "lucide-react";
import { useSidebar } from "../contexts/sidebar-context";

const MENU = [
  { label: "Dashboard", href: "/dashboard", Icon: CircleGauge },
  { label: "Hotspots", href: "/hotspots", Icon: Router },
  { label: "Captive portal", href: "/captive-portal", Icon: SatelliteDish },
  { label: "Settings", href: "/settings", Icon: Cog },
];

export default function NavMenu() {
  return (
    <nav>
      <div className="flex flex-col gap-4">
        {MENU.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            Icon={item.Icon}
          />
        ))}
      </div>
    </nav>
  );
}

function NavLink({
  href,
  label,
  Icon,
}: {
  href: string;
  label: string;
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}) {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();

  // Remove the language segment from pathname
  const pathWithoutLang = pathname.replace(/^\/[^\/]+/, "");
  const isActive = pathWithoutLang.startsWith(href);

  return (
    <Link href={href}>
      <Tooltip isDisabled={!isCollapsed} content={label} placement="right">
        <Button
          fullWidth
          className={`rounded-lg justify-between ${
            isActive
              ? "bg-default text-white dark:text-black"
              : "bg-transparent text-[#2E3132] dark:text-white hover:bg-[#F2F4F4] dark:hover:bg-[#2E3132]"
          }`}
        >
          <div
            className={
              !isCollapsed
                ? "flex flex-row gap-4 items-center"
                : "flex flex-row gap-2 items-center justify-center w-full"
            }
          >
            <Icon
              size={isCollapsed ? 18 : 14}
              className={`${
                isActive
                  ? "text-white dark:text-black"
                  : "text-[#000000] dark:text-[#ffffff]"
              }`}
            />
            {!isCollapsed && label}
          </div>
          {!isCollapsed && <ChevronRight size={16} strokeWidth={3} />}
        </Button>
      </Tooltip>
    </Link>
  );
}
