"use client";

import { ScrollShadow } from "@heroui/react";
import React from "react";

export default function ScrollContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ScrollShadow className="h-screen w-full pt-11" visibility="bottom">
      <div className="p-11">{children}</div>
    </ScrollShadow>
  );
}
