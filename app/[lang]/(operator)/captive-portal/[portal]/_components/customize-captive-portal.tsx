"use client";
import { useState } from "react";
import { Tab, Tabs } from "@heroui/tabs";
import Branding from "./customize-branding";
import AccessFlows from "@/app/[lang]/(operator)/captive-portal/new-portal/_components/access-flows";
import CreateAd from "@/app/[lang]/(operator)/captive-portal/new-portal/_components/create-ad";
import { Hotspot } from "@/app/[lang]/(operator)/hotspots/_services/get-hotspots";
import CustomizePreview from "./customize-preview";
import CustomizePortalSettings from "./customize-portal-settings";
import UpdatePortal from "./update-portal";
import { adFormat } from "@/lib/generated/prisma";

interface Ad {
  id: number;
  format: adFormat;
  portal_config_id: number | null;
  ad_asset_id: number | null;
  interaction_time: number;
}

export interface PortalConfig {
  colors: {
    background: string;
    button: string;
    text: string;
    buttonText: string;
  };
  logo: {
    url: string | null;
    file: File | null;
  };
  banner: {
    url: string | null;
    file: File | null;
  };
  ad: boolean;
  ads: Ad[];
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

export default function CustomizeCaptivePortal({
  hotspots,
  config,
}: {
  hotspots: Hotspot[];
  config: PortalConfig;
}) {
  const [selected, setSelected] = useState("step1");

  // Step 1 - Branding states
  const [colors, setColors] = useState({ ...config.colors });
  const [logoUrl, setLogoUrl] = useState(config.logo.url || null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerUrl, setBannerUrl] = useState(config.banner.url || null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  // Step 2 - Access Flows states
  const [ad, setAd] = useState(config.ad || false);
  const [voucher, setVoucher] = useState(config.voucher || false);
  const [userInfo, setUserInfo] = useState(config.userInfo || false);
  const [welcomeMessage, setWelcomeMessage] = useState(
    config.welcomeMessage || ""
  );

  // Step 3 - Create an Ad states
  const [adFormat, setAdFormat] = useState(config.adFormat || "video");
  const [ads] = useState(config.ads || []);
  const [adUrl, setAdUrl] = useState<string | null>(null);
  const [adFile, setAdFile] = useState<File | null>(null);
  const [interactionTime, setInteractionTime] = useState("15 Seconds");
  const [redirectUrl, setRedirectUrl] = useState(config.redirectUrl);

  // Step 4 - Publish states
  const [portalName, setPortalName] = useState(config.portalName || "");
  const [assignedHotspot, setAssignedHotspot] = useState(
    config.assignedHotspot || ["none"]
  );

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

  const Config: PortalConfig = {
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
    ads: ads,
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
                newConfig={Config}
                fileHandler={handleSelect}
                colorsHandler={setColors}
              />
            </Tab>
            <Tab key="step2" title="Access Flows">
              <AccessFlows
                newConfig={Config}
                adHandler={setAd}
                voucherHandler={setVoucher}
                userInfoHandler={setUserInfo}
                selectedHandler={setSelected}
                welcomeMessageHandler={setWelcomeMessage}
              />
            </Tab>
            <Tab key="step3" title="Create an Ad">
              <CreateAd
                newConfig={Config}
                adFormatHandler={setAdFormat}
                fileHandler={handleSelect}
                interactionTimeHandler={setInteractionTime}
                redirectUrlHandler={setRedirectUrl}
                selectedHandler={setSelected}
              />
            </Tab>
            <Tab key="step4" title="Publish">
              <UpdatePortal
                selectedHandler={setSelected}
                portalConfig={Config}
                nameHandler={setPortalName}
                assignedHotspotHandler={setAssignedHotspot}
                hotspots={hotspots}
              />
            </Tab>
          </Tabs>
        </div>
        {selected !== "step4" ? (
          <CustomizePreview config={Config} />
        ) : (
          <CustomizePortalSettings config={Config} />
        )}
      </div>
      <div className="mt-6 p-4 border rounded">
        <h2 className="text-lg font-semibold mb-2">
          Current Portal Configuration
        </h2>
        <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
          {JSON.stringify(Config, null, 2)}
        </pre>
      </div>
    </div>
  );
}
