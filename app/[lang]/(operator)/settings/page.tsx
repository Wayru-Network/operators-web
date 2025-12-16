import { Metadata } from "next";
import SettingsTabs from "./_components/settings-tabs";
import { getAccountInfo } from "./_services/account-info";
import { getHotspots } from "../hotspots/_services/get-hotspots";
import { BillingProvider } from "./contexts/BillingContext";
import { getCustomerSubscription } from "@/lib/services/subscription-service";
import { getPricings } from "@/lib/services/pricing-services";

export const metadata: Metadata = {
  title: "Settings - Wayru",
};

export default async function Settings() {
  const accountInfo = await getAccountInfo();
  const subscription = await getCustomerSubscription();
  const pricings = await getPricings();
  const hotspots = await getHotspots(1, 50);

  return (
    <div className="flex flex-col space-y-4">
      <p className="text-2xl pb-4">Settings</p>
      <BillingProvider
        hotspots={hotspots?.data}
        subscription={subscription}
        pricings={pricings}
      >
        <SettingsTabs accountInfo={accountInfo} />
      </BillingProvider>
    </div>
  );
}
