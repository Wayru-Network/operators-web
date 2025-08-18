"use client";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Preview from "./preview";
import { Tab, Tabs } from "@heroui/tabs";
import Branding from "@/app/[lang]/(operator)/captive-portal/new-portal/_components/branding";
import AccessFlows from "./access-flows";
import CreateAd from "./create-ad";
import Publish from "./publish";
import PortalSettings from "./portal-settings";
import Link from "next/link";
import { Hotspot } from "@/app/[lang]/(operator)/hotspots/_services/get-hotspots";

const initial = {
  background: "#ffffff",
  text: "#000000",
  button: "#0070f3",
  buttonText: "#ffffff",
};

export interface NewPortalConfig {
  colors: typeof initial;
  logo: {
    url: string | null;
    file: File | null;
  };
  banner: {
    url: string | null;
    file: File | null;
  };
  ad: boolean;
  voucher: boolean;
  userInfo: boolean;
  welcomeMessage: string;
  adFormat: string;
  adAsset?: {
    url: string | null;
    file: File | null;
  };
  interactionTime: string;
  redirectUrl?: string;
  portalName: string;
  assignedHotspot: string[];
}

export default function CreateCaptivePortal({
  hotspots,
}: {
  hotspots: Hotspot[];
}) {
  const [selected, setSelected] = useState("step1");

  // Step 1 - Branding states
  const [colors, setColors] = useState(initial);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  // Step 2 - Access Flows states
  const [ad, setAd] = useState(true);
  const [voucher, setVoucher] = useState(false);
  const [userInfo, setUserInfo] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState(
    "Welcome to our portal!"
  );

  // Step 3 - Create an Ad states
  const [adFormat, setAdFormat] = useState("video");
  const [adUrl, setAdUrl] = useState<string | null>(null);
  const [adFile, setAdFile] = useState<File | null>(null);
  const [interactionTime, setInteractionTime] = useState("15");
  const [redirectUrl, setRedirectUrl] = useState("");

  // Step 4 - Publish states
  const [portalName, setPortalName] = useState("");
  const [assignedHotspot, setAssignedHotspot] = useState(["none"]);

  const handleSelect = (
    file: File,
    url: string,
    assetState: "logo" | "banner" | "ad"
  ) => {
    if (assetState === "logo") {
      if (logoUrl) URL.revokeObjectURL(logoUrl);
      setLogoUrl(url);
      setLogoFile(file);
    } else if (assetState === "banner") {
      if (bannerUrl) URL.revokeObjectURL(bannerUrl);
      setBannerUrl(url);
      setBannerFile(file);
    } else if (assetState === "ad") {
      if (adUrl) URL.revokeObjectURL(adUrl);
      setAdUrl(url);
      setAdFile(file);
    }
  };

  const newConfig: NewPortalConfig = {
    colors,
    logo: {
      url: logoUrl,
      file: logoFile,
    },
    banner: {
      url: bannerUrl,
      file: bannerFile,
    },
    ad: ad,
    voucher,
    userInfo,
    welcomeMessage,
    adFormat,
    adAsset: {
      url: adUrl,
      file: adFile,
    },
    interactionTime,
    redirectUrl: redirectUrl || undefined,
    portalName: portalName,
    assignedHotspot: assignedHotspot,
  };

  return (
    <div className="flex flex-col space-y-2">
      <Link className="rounded-full bg-secondary w-fit" href="/captive-portal">
        <ArrowLeft className="text-black m-3" />
      </Link>
      <h1 className="text-2xl font-normal">Create new portal</h1>
      <div className="flex flex-row">
        <div className="flex flex-col min-w-[50%] max-w-[50%] min-h-full pr-11">
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
              <Publish
                selectedHandler={setSelected}
                portalConfig={newConfig}
                nameHandler={setPortalName}
                assignedHotspotHandler={setAssignedHotspot}
                hotspots={hotspots}
              />
            </Tab>
          </Tabs>
        </div>
        {selected !== "step4" ? (
          <Preview config={newConfig} />
        ) : (
          <PortalSettings config={newConfig} />
        )}
      </div>
    </div>
  );
}
