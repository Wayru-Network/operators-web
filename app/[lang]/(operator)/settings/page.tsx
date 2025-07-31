import { Metadata } from "next";
import SettingsTabs from "./_components/settings-tabs";
import { getAccountInfo } from "./_services/account-info";
import {
  getCustomerSubscriptions,
  getStripeProducts,
} from "@/lib/services/stripe-service";
import { BillingProvider } from "./contexts/BillingContext";

export const metadata: Metadata = {
  title: "Settings - Wayru",
};

export default async function Settings() {
  const accountInfo = await getAccountInfo();
  const subscriptions = await getCustomerSubscriptions();
  const products = await getStripeProducts();

  return (
    <div>
      <h1 className="text-2xl font-normal">Settings</h1>
      <BillingProvider subscriptions={subscriptions} products={products}>
        <SettingsTabs accountInfo={accountInfo} />
      </BillingProvider>
    </div>
  );
}
