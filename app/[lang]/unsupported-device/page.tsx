"use client";
import "@/lib/components/layout/globals.css";
import React from "react";
import useWindowDimensions from "@/lib/hooks/use-dimension";
import { GeistMono, GeistSans } from "@/lib/ui/font";
import { Providers } from "@/lib/components/layout/providers";
import { redirect } from "next/navigation";
import { Spinner } from "@heroui/react";

export default function UnsupportedDevice() {
  const { isMobile, width } = useWindowDimensions();

  if (!width) {
    return (
      <Wrapper>
        <div
          className="h-screen flex items-center justify-center 
        bg-[#F8FAFA] dark:bg-[#101415] p-4"
        >
          <Spinner size="lg" />
        </div>
      </Wrapper>
    );
  }

  if (!isMobile) {
    return redirect("/dashboard");
  }

  return (
    <Wrapper>
      <div className="h-screen flex items-center justify-center bg-[#F8FAFA] dark:bg-[#101415] p-4">
        <div className="flex flex-col">
          <span className="text-xl text-center">
            Looks like you are on mobile device!
          </span>
          <span className="text-base text-center">
            Please open this app on a desktop device for a better experience.
          </span>
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};
