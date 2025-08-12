import { Metadata } from "next";
import SettingsTabs from "./_components/settings-tabs";
import { getAccountInfo } from "./_services/account-info";
import { getStripeProducts } from "@/lib/services/stripe-service";
import { BillingProvider } from "./contexts/BillingContext";
import { getHotspotsToAssign } from "../hotspots/_services/get-hotspots";

export const metadata: Metadata = {
  title: "Settings - Wayru",
};

export default async function Settings() {
  const accountInfo = await getAccountInfo();
  const products = await getStripeProducts();
  const hotspots = await getHotspotsToAssign();

  return (
    <div className="flex flex-col space-y-4">
      <p className="text-2xl pb-4">Settings</p>
      <BillingProvider hotspots={hotspots} products={products}>
        <SettingsTabs accountInfo={accountInfo} />
      </BillingProvider>
    </div>
  );
}
