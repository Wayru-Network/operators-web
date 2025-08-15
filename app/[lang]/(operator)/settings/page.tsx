import { Metadata } from "next";
import SettingsTabs from "./_components/settings-tabs";
import { getAccountInfo } from "./_services/account-info";
import { getStripeProducts } from "@/lib/services/stripe-service";
import { BillingProvider } from "./contexts/BillingContext";
import { getHotspots } from "../hotspots/_services/get-hotspots";

export const metadata: Metadata = {
  title: "Settings - Wayru",
};

export default async function Settings() {
  const accountInfo = await getAccountInfo();
  const products = await getStripeProducts();
  const hotspots = await getHotspots(1, 50);

  return (
    <div className="flex flex-col space-y-4">
      <p className="text-2xl pb-4">Settings</p>
      <BillingProvider hotspots={hotspots?.data} products={products}>
        <SettingsTabs accountInfo={accountInfo} />
      </BillingProvider>
    </div>
  );
}
