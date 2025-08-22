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
          />
        </EaseInOutContent>
      </Tab>
      <Tab key="networks" title="Networks">
        <EaseInOutContent>
          <HotspotNetworks
            {...networks}
            locationName={locationName}
            onLocationNameChange={setLocationName}
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
