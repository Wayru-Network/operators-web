"use client";
import { Tab, Tabs } from "@heroui/tabs";
import Account from "./account";
import Billing from "./Billing/billing";
import Reports from "./Reports";

export default function SettingsTabs() {
  return (
    <div className="w-full min-h-[600px]">
      <Tabs
        fullWidth
        classNames={{
          tabList:
            "border-b-2 p-0 border-gray-200 dark:border-gray-700 sticky top-0 bg-white  z-10",
          panel:
            "bg-[#ffffff] dark:bg-[#191c1d] rounded-[30px] my-2 p-10 min-h-[500px]",
          tab: "pb-4",
          cursor: "w-full",
          tabContent: "text-lg text-gray-900 dark:text-white",
        }}
        variant="underlined"
        color="primary"
      >
        <Tab key="Account" title="Account">
          <Account />
        </Tab>
        <Tab key="Billing" title="Billing">
          <Billing />
        </Tab>
        <Tab key="Reports" title="Reports">
          <Reports />
        </Tab>
      </Tabs>
    </div>
  );
}
