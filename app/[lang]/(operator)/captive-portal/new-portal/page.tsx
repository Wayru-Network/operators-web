"use client";
import Image from "next/image";
import FileInput from "./_components/file-input";
import ColorSettings from "./_components/color-settings";
import { Button } from "@heroui/button";
import { useState } from "react";

const initial = {
  background: "#ffffff",
  button: "#0070f3",
  text: "#000000",
};

export default function CaptivePortal() {
  const [colors, setColors] = useState(initial);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  const handleSelect = (
    file: File,
    url: string,
    assetState: "logo" | "banner"
  ) => {
    if (assetState === "logo") {
      if (logoUrl) URL.revokeObjectURL(logoUrl);
      setLogoUrl(url);
    } else {
      if (bannerUrl) URL.revokeObjectURL(bannerUrl);
      setBannerUrl(url);
    }
  };

  const handleReset = () => {
    if (logoUrl) URL.revokeObjectURL(logoUrl);
    setLogoUrl(null);
    if (bannerUrl) URL.revokeObjectURL(bannerUrl);
    setBannerUrl(null);
  };

  return (
    <div className="flex flex-col space-y-4">
      <a className="rounded-full bg-secondary w-fit" href="/captive-portal">
        <Image
          src="/assets/arrow-back.svg"
          alt="Back arrow"
          width={43}
          height={43}
          className="hover:cursor-pointer"
        />
      </a>
      <h1 className="text-2xl font-normal pb-2">Create new portal</h1>
      <div className="flex flex-row justify-between gap-20">
        <div className="w-1/2 flex flex-col justify-start bg-[#ffffff] dark:bg-[#191c1d] rounded-[30px] p-8 space-y-4">
          <p className="font-bold text-lg">Step 1: Branding</p>
          <p className="font-semibold">Logo</p>
          <FileInput
            onSelect={(file, url) => handleSelect(file, url, "logo")}
          />
          <p className="font-semibold">Banner Image</p>
          <FileInput
            onSelect={(file, url) => handleSelect(file, url, "banner")}
          />
          <p className="font-semibold">Theme settings</p>
          <ColorSettings value={colors} onChange={setColors} />
          <Button className="w-full text-white dark:text-black rounded-full mt-4">
            Next step
          </Button>
        </div>
        <div className="flex flex-col w-1/2 min-h-full bg-[#ffffff] dark:bg-[#191c1d] rounded-[30px] p-8">
          <p className="font-bold text-lg pb-4">Preview</p>
          <div
            className="h-full min-w-full bg-[#F8FAFA] dark:bg-gray-600 rounded-[10px] flex flex-col space-y-4 p-8"
            style={{
              backgroundColor: colors.background,
              color: colors.text,
            }}
          >
            {logoUrl && (
              <div className="flex flex-col">
                <Image src={logoUrl} alt="Logo" width={30} height={30} />
              </div>
            )}
            {bannerUrl && (
              <div className="flex flex-col items-center justify-center h-full">
                <Image src={bannerUrl} alt="Banner" width={300} height={100} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
