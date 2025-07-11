"use client";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Preview from "./_components/preview";
import { Tab, Tabs } from "@heroui/tabs";
import Branding from "@/app/[lang]/(operator)/captive-portal/new-portal/_components/branding";
import AccessFlows from "./_components/access-flows";
import CreateAd from "./_components/create-ad";
import Publish from "./_components/publish";
import PortalSettings from "./_components/portal-settings";
import Link from "next/link";

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
  portalName: string;
  assignedHotspot: string[]; // This will be set in the AssignHotspot component
}

export default function CaptivePortal() {
  const [selected, setSelected] = useState("step1");

  // Step 1 - Branding states
  const [colors, setColors] = useState(initial);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  // Step 2 - Access Flows states
  const [ad, setAd] = useState(true);
  const [voucher, setVoucher] = useState(true);
  const [userInfo, setUserInfo] = useState(true);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Step 3 - Create an Ad states
  const [adFormat, setAdFormat] = useState("video");
  const [adUrl, setAdUrl] = useState<string | null>(null);
  const [interactionTime, setInteractionTime] = useState("15s");
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
    portalName: portalName,
    assignedHotspot: assignedHotspot, // This will be set in the AssignHotspot component
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
              <Publish
                selectedHandler={setSelected}
                portalConfig={newConfig}
                nameHandler={setPortalName}
                assignedHotspotHandler={setAssignedHotspot}
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
      {/* <div className="mt-6 p-4 border rounded">
        <h2 className="text-lg font-semibold mb-2">
          Current Portal Configuration
        </h2>
        <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
          {JSON.stringify(newConfig, null, 2)}
        </pre>
      </div> */}
    </div>
  );
}
