"use client";

import React from "react";

export default function StickyHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed top-0 left-0 right-5 z-50 bg-[#F8FAFA] dark:bg-[#101415] backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
      <div className="flex flex-row gap-x-4 justify-end items-center py-4 pr-10">
        {children}
      </div>
    </div>
  );
}
