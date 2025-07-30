"use client";

import { ScrollShadow } from "@heroui/react";
import React from "react";

export default function ScrollContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ScrollShadow className="h-screen w-full" visibility="both">
      <div className="p-11">{children}</div>
    </ScrollShadow>
  );
}
