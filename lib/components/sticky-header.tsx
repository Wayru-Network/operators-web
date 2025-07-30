"use client";

import React from "react";

export default function StickyHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="sticky top-0 z-50 bg-[#F8FAFA] dark:bg-[#101415] backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
      <div className="flex flex-row gap-x-4 justify-end items-center px-6 py-4">
        {children}
      </div>
    </div>
  );
}
