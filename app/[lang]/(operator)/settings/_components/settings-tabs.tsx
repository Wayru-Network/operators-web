"use client";
import { Tab, Tabs } from "@heroui/tabs";

export default function SettingsTabs() {
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
      <Tab key="Account" title="Account">
        <p className="text-lg font-semibold">Account Information</p>
      </Tab>
      <Tab key="Billing" title="Billing">
        <p className="text-lg font-semibold">Billing Information</p>
        <div className="mt-4">
          <p>Plan: Premium</p>
          <p>Next Payment Date: 01/01/2024</p>
          <p>Status: Active</p>
        </div>
      </Tab>
      <Tab key="Reports" title="Reports">
        <p className="text-lg font-semibold">Reports</p>
        <div className="mt-4">
          <p>Usage Statistics: 100GB</p>
          <p>Connected Clients: 50</p>
          <p>Last Report Generated: 12/01/2023</p>
        </div>
      </Tab>
    </Tabs>
  );
}
