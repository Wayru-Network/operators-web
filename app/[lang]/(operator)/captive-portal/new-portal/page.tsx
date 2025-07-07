"use client";
import FileInput from "./_components/file-input";
import ColorSettings from "./_components/color-settings";
import { Button } from "@heroui/button";
import { useState } from "react";
import { ArrowLeft, Star } from "lucide-react";
import Preview from "./_components/preview";
import { Tab, Tabs } from "@heroui/tabs";
import { Switch } from "@heroui/switch";

const initial = {
  background: "#ffffff",
  button: "#0070f3",
  text: "#000000",
};

export default function CaptivePortal() {
  const [selected, setSelected] = useState("step1");

  // Step 1 - Branding states
  const [colors, setColors] = useState(initial);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  // Step 2 - Access Flows states
  const [ad, setAd] = useState(true);
  const [voucher, setVoucher] = useState(false);
  const [userInfo, setUserInfo] = useState(false);

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
    <div className="flex flex-col space-y-2">
      <a className="rounded-full bg-secondary w-fit" href="/captive-portal">
        <ArrowLeft className="text-black m-3" />
      </a>
      <h1 className="text-2xl font-normal">Create new portal</h1>
      <Tabs
        classNames={{
          tabList: "hidden",
        }}
        selectedKey={selected}
        onSelectionChange={(key) => setSelected(String(key))}
      >
        <Tab key="step1" title="step1">
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
              <div className="flex gap-2 mt-4">
                <Button
                  className="w-full text-white dark:text-black rounded-full"
                  onPress={() => setSelected("step2")}
                >
                  Next step
                </Button>
              </div>
            </div>
            <Preview
              logoUrl={logoUrl ?? undefined}
              bannerUrl={bannerUrl ?? undefined}
              colors={colors}
            />
          </div>
        </Tab>
        <Tab key="step2" title="Access Flows">
          <div className="flex flex-row justify-between gap-20">
            <div className="w-1/2 flex flex-col justify-start bg-[#ffffff] dark:bg-[#191c1d] rounded-[30px] p-8 space-y-4">
              <p className="font-bold text-lg">Step 2: Access Flows</p>
              <p className="font-semibold text-lg">Access mechanisms</p>
              <div className="flex flex-col space-y-4 w-full rounded-[10px] bg-[#F8FAFA] dark:bg-[#858585] p-4">
                <div className="flex flex-row items-center">
                  <Star className="mr-2" size={30} />
                  <div className="flex flex-col justify-center w-full">
                    <p className="font-semibold text-black">
                      Watch ad to connect
                    </p>
                    <p className="text-sm text-black">
                      Users watch an advertisement to gain access
                    </p>
                  </div>
                  <Switch isSelected={ad} onValueChange={setAd} />
                </div>
                <div className="flex flex-row items-center">
                  <Star className="mr-2" size={30} />
                  <div className="flex flex-col justify-center w-full">
                    <p className="font-semibold text-black">
                      Enter voucher code
                    </p>
                    <p className="text-sm text-black">
                      Users enter a valid voucher code to connect
                    </p>
                  </div>
                  <Switch isSelected={voucher} onValueChange={setVoucher} />
                </div>
                <div className="flex flex-row items-center">
                  <Star className="mr-2" size={30} />
                  <div className="flex flex-col justify-center w-full">
                    <p className="font-semibold text-black">Submit user info</p>
                    <p className="text-sm text-black">
                      Collect user information before granting access
                    </p>
                  </div>
                  <Switch isSelected={userInfo} onValueChange={setUserInfo} />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  className="w-full text-white dark:text-black rounded-full"
                  onPress={() => setSelected("step1")}
                >
                  Previous
                </Button>
                <Button className="w-full text-white dark:text-black rounded-full">
                  Next step
                </Button>
              </div>
            </div>
            <Preview
              logoUrl={logoUrl ?? undefined}
              bannerUrl={bannerUrl ?? undefined}
              colors={colors}
            />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
