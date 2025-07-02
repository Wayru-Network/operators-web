"use client";
import { Tab, Tabs } from "@heroui/tabs";

export default function HotspotTabs({ hotspot }: { hotspot: string }) {
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
      //"w-full h-full bg-[#ffffff] dark:bg-[#191c1d] rounded-[30px] my-2 p-10"
    >
      <Tab key="device-info" title="Device Information">
        <p className="text-lg font-semibold">Device Information</p>
        <div className="mt-4">
          <p>Hotspot Name: {hotspot}</p>
          <p>MAC Address: 00:1A:2B:3C:4D:5E</p>
          <p>Status: Online</p>
          <p>Assigned Portal: Main Portal</p>
        </div>
      </Tab>
      <Tab key="networks" title="Networks">
        <p className="text-lg font-semibold">Network Information</p>
        <div className="mt-4">
          <p>SSID: MyHotspot</p>
          <p>IP Address: 192.168.1.1</p>
          <p>Connected Clients: 10</p>
        </div>
      </Tab>
      <Tab key="captive-portal" title="Captive Portal">
        <p className="text-lg font-semibold">Captive Portal</p>
        <div className="mt-4">
          <p>Portal URL: https://portal.wayru.com</p>
          <p>Login Required: Yes</p>
          <p>Terms of Service: Accepted</p>
        </div>
      </Tab>
    </Tabs>
  );
}
