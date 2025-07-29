"use client";
import { Tab, Tabs } from "@heroui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Account from "./account";
import Billing from "./Billing/billing";
import Reports from "./Reports";
import { AccountInfo } from "../_services/account-info";

export default function SettingsTabs({
  accountInfo,
}: {
  accountInfo: AccountInfo;
}) {
  const [selectedTab, setSelectedTab] = useState("Account");

  const handleSelectionChange = (key: React.Key) => {
    setSelectedTab(key as string);
  };

  // Component to animate the tabs for making the transition easeInOut
  const AnimatedContent = ({ children }: { children: React.ReactNode }) => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
        type: "tween",
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );

  return (
    <div className="w-full min-h-[600px]">
      <Tabs
        selectedKey={selectedTab}
        onSelectionChange={handleSelectionChange}
        fullWidth
        classNames={{
          tabList:
            "border-b-2 p-0 border-gray-200 dark:border-gray-700 sticky top-0 bg-white z-10",
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
          <AnimatePresence mode="wait">
            {selectedTab === "Account" && (
              <AnimatedContent key="account">
                <Account accountInfo={accountInfo} />
              </AnimatedContent>
            )}
          </AnimatePresence>
        </Tab>
        <Tab key="Billing" title="Billing">
          <AnimatePresence mode="wait">
            {selectedTab === "Billing" && (
              <AnimatedContent key="billing">
                <Billing />
              </AnimatedContent>
            )}
          </AnimatePresence>
        </Tab>
        <Tab key="Reports" title="Reports">
          <AnimatePresence mode="wait">
            {selectedTab === "Reports" && (
              <AnimatedContent key="reports">
                <Reports />
              </AnimatedContent>
            )}
          </AnimatePresence>
        </Tab>
      </Tabs>
    </div>
  );
}
