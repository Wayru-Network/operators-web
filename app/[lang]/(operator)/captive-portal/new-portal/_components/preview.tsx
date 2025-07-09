"use client";
import Image from "next/image";
import { Button } from "@heroui/button";
import { useState } from "react";

interface PreviewProps {
  logoUrl?: string;
  bannerUrl?: string;
  colors: {
    background: string;
    text: string;
    button: string;
  };
}

export default function Preview({ logoUrl, bannerUrl, colors }: PreviewProps) {
  return (
    <div className="flex flex-col min-h-[51rem] max-h-[51rem] bg-[#ffffff] dark:bg-[#191c1d] rounded-[30px] p-8">
      <p className="font-bold text-lg pb-4">Preview</p>
      <div
        className="h-full min-w-full bg-[#F8FAFA] dark:bg-gray-600 text-black rounded-[10px] flex flex-col space-y-4 p-8"
        style={{
          backgroundColor: colors.background,
        }}
      >
        {logoUrl ? (
          <div className="flex flex-col">
            <Image src={logoUrl} alt="Logo" width={30} height={30} />
          </div>
        ) : (
          <div className="flex items-center justify-center min-w-full h-20 bg-[#D9D9D9] rounded-sm sm:w-96">
            Logo
          </div>
        )}
        <div className="flex flex-col flex-1">
          <div className="flex flex-col items-center  gap-4 my-auto">
            <Button
              className="w-full text-white dark:text-black rounded-full"
              style={{ backgroundColor: colors.button, color: colors.text }}
            >
              Connect to Wi-Fi
            </Button>
            <Button
              className="w-full text-white dark:text-black rounded-full"
              style={{ backgroundColor: colors.button, color: colors.text }}
            >
              Connect to Wi-Fi
            </Button>
            <Button
              className="w-full text-white dark:text-black rounded-full"
              style={{ backgroundColor: colors.button, color: colors.text }}
            >
              Connect to Wi-Fi
            </Button>
          </div>
          {bannerUrl ? (
            <div className="flex flex-col items-center w-full h-40 mt-auto">
              <Image src={bannerUrl} alt="Banner" width={300} height={100} />
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-40 bg-[#D9D9D9] rounded-sm mt-auto">
              Banner
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
