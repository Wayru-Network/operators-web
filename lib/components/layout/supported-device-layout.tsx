"use client";

import useDimension from "@/lib/hooks/use-dimension";
import { LayoutProps } from "@/lib/interfaces/page";
import { Spinner } from "@heroui/react";
import { redirect } from "next/navigation";

const CheckSupportedDeviceLayout = ({ children }: LayoutProps) => {
  const { isMobile, width } = useDimension();

  if (!width) {
    return (
      <div
        className="h-screen flex items-center justify-center 
        bg-[#F8FAFA] dark:bg-[#101415] p-4"
      >
        <Spinner size="lg" />
      </div>
    );
  }

  if (isMobile) {
    return redirect("/unsupported-device");
  }

  return <div>{children}</div>;
};

export default CheckSupportedDeviceLayout;
