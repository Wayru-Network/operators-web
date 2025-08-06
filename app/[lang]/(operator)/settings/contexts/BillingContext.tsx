"use client";

import { StripeProduct } from "@/lib/interfaces/stripe";
import { createContext, useContext, useState } from "react";
import { useSubscriptions } from "../_hooks/use-subscriptions";

interface BillingProviderProps {
  children: React.ReactNode;
  products: StripeProduct[];
}

type BillingContextType = {
  subscriptions: any[];
  products: StripeProduct[];
  hotspotsToAdd: number;
  isLoading: boolean;
  handleHotspotsToAdd: (hotspots: number) => void;
  refreshSubscriptions: () => Promise<void>;
};

const BillingContext = createContext<BillingContextType>({
  subscriptions: [],
  products: [],
  hotspotsToAdd: 0,
  isLoading: false,
  handleHotspotsToAdd: (hotspots: number) => {},
  refreshSubscriptions: async () => {},
});

export const BillingProvider = ({
  children,
  products,
}: BillingProviderProps) => {
  const [hotspotsToAdd, setHotspotsToAdd] = useState(0);
  const { subscriptions, isLoading, refreshSubscriptions } = useSubscriptions();

  const handleHotspotsToAdd = (hotspots: number) => {
    setHotspotsToAdd(hotspots);
  };

  return (
    <BillingContext.Provider
      value={{
        subscriptions,
        products,
        hotspotsToAdd,
        isLoading,
        handleHotspotsToAdd,
        refreshSubscriptions: async () => {
          await refreshSubscriptions();
        },
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
