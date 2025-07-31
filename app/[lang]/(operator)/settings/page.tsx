import { Metadata } from "next";
import SettingsTabs from "./_components/settings-tabs";
import { getAccountInfo } from "./_services/account-info";
import { getSubscriptionWithBillingDetails } from "@/lib/services/stripe-service";

export const metadata: Metadata = {
  title: "Settings - Wayru",
};

export default async function Settings() {
  const accountInfo = await getAccountInfo();
  const subscriptions = await getSubscriptionWithBillingDetails(
    "sub_1RlcejRhdztWAcIsMtkz3RUE"
  );

  return (
    <div>
      <h1 className="text-2xl font-normal">Settings</h1>
      <SettingsTabs accountInfo={accountInfo} subscription={subscriptions} />
    </div>
  );
}
