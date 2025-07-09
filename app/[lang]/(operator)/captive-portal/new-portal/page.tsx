"use client";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Preview from "./_components/preview";
import { Tab, Tabs } from "@heroui/tabs";
import Branding from "@/app/[lang]/(operator)/captive-portal/new-portal/_components/branding";
import AccessFlows from "./_components/access-flows";
import CreateAd from "./_components/create-ad";
import { Button } from "@heroui/button";
const initial = {
  background: "#ffffff",
  button: "#0070f3",
  text: "#000000",
};

export interface NewPortalConfig {
  colors: typeof initial;
  logoUrl: string | null;
  bannerUrl: string | null;
  ad: boolean;
  voucher: boolean;
  userInfo: boolean;
  welcomeMessage: string;
  successMessage: string;
  adFormat: string;
  adUrl: string | null;
  interactionTime: string;
  redirectUrl?: string;
}

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
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Step 3 - Create an Ad states
  const [adFormat, setAdFormat] = useState("video");
  const [adUrl, setAdUrl] = useState<string | null>(null);
  const [interactionTime, setInteractionTime] = useState("15s");
  const [redirectUrl, setRedirectUrl] = useState("");

  const handleSelect = (
    file: File,
    url: string,
    assetState: "logo" | "banner" | "ad"
  ) => {
    if (assetState === "logo") {
      if (logoUrl) URL.revokeObjectURL(logoUrl);
      setLogoUrl(url);
    } else if (assetState === "banner") {
      if (bannerUrl) URL.revokeObjectURL(bannerUrl);
      setBannerUrl(url);
    } else if (assetState === "ad") {
      if (adUrl) URL.revokeObjectURL(adUrl);
      setAdUrl(url);
    }
  };

  const newConfig: NewPortalConfig = {
    colors,
    logoUrl,
    bannerUrl,
    ad,
    voucher,
    userInfo,
    welcomeMessage,
    successMessage,
    adFormat,
    adUrl,
    interactionTime,
    redirectUrl: redirectUrl || undefined,
  };

  return (
    <div className="flex flex-col space-y-2">
      <a className="rounded-full bg-secondary w-fit" href="/captive-portal">
        <ArrowLeft className="text-black m-3" />
      </a>
      <h1 className="text-2xl font-normal">Create new portal</h1>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col min-w-[50%] min-h-full">
          <Tabs
            classNames={{
              tabList: "!hidden",
              panel: "p-0 min-h-full",
            }}
            selectedKey={selected}
            onSelectionChange={(key) => setSelected(String(key))}
          >
            <Tab key="step1" title="Branding">
              <Branding
                selectedHandler={setSelected}
                newConfig={newConfig}
                fileHandler={handleSelect}
                colorsHandler={setColors}
              />
            </Tab>
            <Tab key="step2" title="Access Flows">
              <AccessFlows
                newConfig={newConfig}
                adHandler={setAd}
                voucherHandler={setVoucher}
                userInfoHandler={setUserInfo}
                selectedHandler={setSelected}
                welcomeMessageHandler={setWelcomeMessage}
                successMessageHandler={setSuccessMessage}
              />
            </Tab>
            <Tab key="step3" title="Create an Ad">
              <CreateAd
                newConfig={newConfig}
                adFormatHandler={setAdFormat}
                fileHandler={handleSelect}
                interactionTimeHandler={setInteractionTime}
                redirectUrlHandler={setRedirectUrl}
                selectedHandler={setSelected}
              />
            </Tab>
            <Tab key="step4" title="Publish">
              <div className="h-full flex flex-col justify-start bg-[#ffffff] dark:bg-[#191c1d] rounded-[30px] p-8 space-y-4">
                <p className="font-bold text-lg">Step 4: Publish</p>
                <p className="font-semibold text-lg">Portal Name</p>
                <div className="flex gap-2 mt-auto">
                  <Button
                    className="w-full text-white dark:text-black rounded-full"
                    onPress={() => setSelected("step2")}
                  >
                    Previous
                  </Button>
                  <Button
                    className="w-full text-white dark:text-black rounded-full"
                    onPress={() => setSelected("step4")}
                  >
                    Next step
                  </Button>
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
        <Preview
          logoUrl={newConfig.logoUrl ?? undefined}
          bannerUrl={newConfig.bannerUrl ?? undefined}
          colors={newConfig.colors}
        />
      </div>
    </div>
  );
}
