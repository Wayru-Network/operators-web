"use client";

import { Button } from "@heroui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="rounded-[10px] border-[#c9cecf] bg-none"
    >
      {mounted ? (
        theme === "dark" ? (
          <Moon size={18} />
        ) : (
          <Sun size={18} />
        )
      ) : null}
    </Button>
  );
}
