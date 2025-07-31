"use client";

import { StripeProduct, StripeSubscription } from "@/lib/interfaces/stripe";
import { createContext, useContext, useState } from "react";

export type BillingStatus =
  | "plan-not-selected"
  | "plan-active"
  | "select-a-plan"
  | "plan-checkout";
export type BillingStatusHistory = "Select a plan" | "Checkout" | "Active plan";

export type BillingStatusHistories = Array<{
  status: BillingStatusHistory;
  component: BillingStatus;
}>;

interface BillingProviderProps {
  children: React.ReactNode;
  subscriptions: StripeSubscription[];
  products: StripeProduct[];
}

type BillingContextType = Omit<BillingProviderProps, "children"> & {
  billingStatus: BillingStatus;
  changeBillingStatus: (status: BillingStatus) => void;
  hotspotsToAdd: number;
  handleHotspotsToAdd: (hotspots: number) => void;
  billingStatusHistory: BillingStatusHistories;
  goBack: () => void;
};

const BillingContext = createContext<BillingContextType>({
  billingStatus: "plan-not-selected",
  changeBillingStatus: (status: BillingStatus) => {},
  subscriptions: [],
  products: [],
  hotspotsToAdd: 0,
  handleHotspotsToAdd: (hotspots: number) => {},
  billingStatusHistory: [],
  goBack: () => {},
});

export const BillingProvider = ({
  children,
  subscriptions,
  products,
}: BillingProviderProps) => {
  const [billingStatus, setBillingStatus] =
    useState<BillingStatus>("plan-not-selected");
  const [hotspotsToAdd, setHotspotsToAdd] = useState(0);
  const [billingStatusHistory, setBillingStatusHistory] =
    useState<BillingStatusHistories>([]);

  const changeBillingStatus = (status: BillingStatus) => {
    setBillingStatus(status);
    switch (status) {
      case "select-a-plan":
        setBillingStatusHistory((prev) => [
          ...prev,
          { status: "Select a plan", component: status },
        ]);
        break;
      case "plan-checkout":
        setBillingStatusHistory((prev) => [
          ...prev,
          { status: "Checkout", component: status },
        ]);
        break;
      case "plan-active":
        setBillingStatusHistory((prev) => [
          ...prev,
          { status: "Active plan", component: status },
        ]);
        break;
    }
  };

  const handleHotspotsToAdd = (hotspots: number) => {
    setHotspotsToAdd(hotspots);
  };

  const goBack = () => {
    setBillingStatusHistory((prev) => prev.slice(0, -1));
    const previousStatus = billingStatusHistory.slice(-2)[0].component;
    setBillingStatus(previousStatus);
  };

  return (
    <BillingContext.Provider
      value={{
        billingStatus,
        changeBillingStatus,
        subscriptions,
        products,
        hotspotsToAdd,
        handleHotspotsToAdd,
        billingStatusHistory,
        goBack,
      }}
    >
      {children}
    </BillingContext.Provider>
  );
};

export const useBilling = () => {
  const context = useContext(BillingContext);
  if (!context) {
    throw new Error("useBilling must be used within a BillingProvider");
  }
  return context;
};
