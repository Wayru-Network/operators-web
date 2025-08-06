"use client";
import { Tab, Tabs } from "@heroui/tabs";
import Account from "./Account";
import Billing from "./Billing/Billing";
import Reports from "./Reports";
import { AccountInfo } from "../_services/types";
import EaseInOutContent from "@/lib/components/ease-in-out-content";

export default function SettingsTabs({
  accountInfo,
}: {
  accountInfo: AccountInfo;
}) {
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
        <EaseInOutContent>
          <Account accountInfo={accountInfo} />
        </EaseInOutContent>
      </Tab>
      <Tab key="Billing" title="Billing">
        <Billing />
      </Tab>
      <Tab key="Reports" title="Reports">
        <EaseInOutContent>
          <Reports />
        </EaseInOutContent>
      </Tab>
    </Tabs>
  );
}
