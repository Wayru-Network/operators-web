"use client";

import { ChevronRight, ChevronLeft } from "lucide-react";
import { useSidebar } from "../contexts/sidebar-context";

export default function ToggleSidebar() {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <div
      onClick={toggleSidebar}
      className="cursor-pointer group absolute bottom-4 right-4 z-50 flex flex-row gap-2 items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 border border-gray-200 dark:border-gray-700"
    >
      {isCollapsed ? (
        <ChevronRight
          size={20}
          className="cursor-pointer text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-white transition-colors"
        />
      ) : (
        <ChevronLeft
          size={20}
          className="cursor-pointer text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-white transition-colors"
        />
      )}
    </div>
  );
}
