"use client";

import { Tab, Tabs } from "@heroui/tabs";
import HotspotDeviceInfo, { DeviceInfoProps } from "./hotspot-device-info";
import HotspotNetworks, { HotspotNetworksProps } from "./hotspot-networks";
import HotspotCaptivePortal from "./hotspot-captive-portal";
import EaseInOutContent from "@/lib/components/ease-in-out-content";
import { useState } from "react";

export interface HotspotTabsProps {
  info: DeviceInfoProps;
  networks: HotspotNetworksProps;
}

export default function HotspotTabs({ info, networks }: HotspotTabsProps) {
  const isDisabledCaptivePortal = true;

  const [locationName, setLocationName] = useState(
    info.basic.locationName || ""
  );

  const [openSSID, setOpenSSID] = useState(networks.openNetwork.ssid || "");
  const [privateSSID, setPrivateSSID] = useState(
    networks.privateNetwork.ssid || ""
  );
  const [privatePassword, setPrivatePassword] = useState(
    networks.privateNetwork.password || ""
  );

  networks.openNetwork.ssid = openSSID;
  networks.privateNetwork.ssid = privateSSID;
  networks.privateNetwork.password = privatePassword;

  return (
    <Tabs
      fullWidth
      classNames={{
        tabList: "border-b-2 p-0 border-gray-200 dark:border-gray-700",
        panel: "bg-[#ffffff] dark:bg-[#191c1d] rounded-[30px] my-2 p-10",
        tab: "pb-4",
        cursor: "w-full",
        tabContent: "text-lg text-gray-900 dark:text-white",
      }}
      variant="underlined"
      color="primary"
    >
      <Tab key="device-info" title="Device Information">
        <EaseInOutContent>
          <HotspotDeviceInfo
            {...info}
            basic={{ ...info.basic, locationName }}
            network={{
              ...info.network,
              openNetwork: { ssid: openSSID },
              privateNetwork: { ssid: privateSSID, password: privatePassword },
            }}
          />
        </EaseInOutContent>
      </Tab>
      <Tab key="networks" title="Networks">
        <EaseInOutContent>
          <HotspotNetworks
            {...networks}
            locationName={locationName}
            onLocationNameChange={setLocationName}
            onOpenSSIDChange={setOpenSSID}
            onPrivateSSIDChange={setPrivateSSID}
            onPrivatePasswordChange={setPrivatePassword}
          />
        </EaseInOutContent>
      </Tab>
      {!isDisabledCaptivePortal && (
        <Tab key="captive-portal" title="Captive Portal">
          <EaseInOutContent>
            <HotspotCaptivePortal />
          </EaseInOutContent>
        </Tab>
      )}
    </Tabs>
  );
}
