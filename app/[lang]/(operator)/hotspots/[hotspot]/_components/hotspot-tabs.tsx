"use client";

import { Tab, Tabs } from "@heroui/tabs";
import HotspotDeviceInfo, { DeviceInfoProps } from "./hotspot-device-info";
import HotspotNetworks, { HotspotNetworksProps } from "./hotspot-networks";
import HotspotCaptivePortal from "./hotspot-captive-portal";
import EaseInOutContent from "@/lib/components/ease-in-out-content";

export interface HotspotTabsProps {
  info: DeviceInfoProps;
  networks: HotspotNetworksProps;
}

export default function HotspotTabs({ info, networks }: HotspotTabsProps) {
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
          <HotspotDeviceInfo {...info} />
        </EaseInOutContent>
      </Tab>
      <Tab key="networks" title="Networks">
        <EaseInOutContent>
          <HotspotNetworks {...networks} />
        </EaseInOutContent>
      </Tab>
      <Tab key="captive-portal" title="Captive Portal">
        <EaseInOutContent>
          <HotspotCaptivePortal />
        </EaseInOutContent>
      </Tab>
    </Tabs>
  );
}
