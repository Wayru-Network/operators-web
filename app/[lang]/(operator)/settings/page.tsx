import { Metadata } from "next";
import SettingsTabs from "./_components/settings-tabs";

export const metadata: Metadata = {
  title: "Settings - Wayru",
};

export default function Settings() {
  return (
    <div>
      <h1 className="text-2xl font-normal">Settings</h1>
      <SettingsTabs />
    </div>
  );
}
