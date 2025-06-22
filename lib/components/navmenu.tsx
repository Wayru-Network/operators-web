"use client";

import { Button } from "@heroui/button";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const MENU = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Hotspots", href: "/hotspots" },
  { label: "Captive portal", href: "/captive-portal" },
  { label: "Settings", href: "/settings" },
];

export default function NavMenu() {
  return (
    <nav>
      <div className="flex flex-col gap-4">
        {MENU.map((item) => (
          <NavLink key={item.href} href={item.href} label={item.label} />
        ))}
      </div>
    </nav>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();

  // Remove the language segment from pathname
  const pathWithoutLang = pathname.replace(/^\/[^\/]+/, "");
  const isActive = pathWithoutLang.startsWith(href);

  return (
    <Link href={href}>
      <Button
        fullWidth
        className={`justify-between ${isActive ? "bg-default text-white dark:text-black" : "bg-transparent text-[#2E3132] dark:text-white hover:bg-[#F2F4F4] dark:hover:bg-[#2E3132]"}`}
      >
        <div className="flex flex-row gap-4 items-center">
          <Image
            className={`dark:invert ${!isActive ? "invert dark:invert-0" : ""}`}
            src="/assets/triangle.svg"
            alt="Menu triangle icon"
            width={14}
            height={12}
          />
          {label}
        </div>
        <ChevronRight size={16} strokeWidth={3} />
      </Button>
    </Link>
  );
}
