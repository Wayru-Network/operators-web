"use client";

import { StripeProduct, StripeSubscription } from "@/lib/interfaces/stripe";
import { createContext, useCallback, useContext, useState } from "react";
import { useSubscriptions } from "../_hooks/use-subscriptions";
import { Hotspot } from "../../hotspots/_services/get-hotspots";

interface BillingProviderProps {
  children: React.ReactNode;
  products: StripeProduct[];
  hotspots: Hotspot[];
}

type BillingContextType = {
  subscriptions: StripeSubscription[];
  products: StripeProduct[];
  hotspotsToAdd: number;
  isLoading: boolean;
  handleHotspotsToAdd: (hotspots: number) => void;
  refreshSubscriptions: () => Promise<void>;
  hotspots: Hotspot[];
  addHotspot: (h: Hotspot[]) => void;
};

const BillingContext = createContext<BillingContextType>({
  subscriptions: [],
  products: [],
  hotspotsToAdd: 0,
  isLoading: false,
  handleHotspotsToAdd: () => {},
  refreshSubscriptions: async () => {},
  hotspots: [],
  addHotspot: () => {},
});

export const BillingProvider = ({
  children,
  products,
  hotspots: hotspotsProps,
}: BillingProviderProps) => {
  const [hotspotsToAdd, setHotspotsToAdd] = useState(0);
  const { subscriptions, isLoading, refreshSubscriptions } = useSubscriptions();
  const [hotspots, setHotspots] = useState(hotspotsProps);

  const handleHotspotsToAdd = (hotspots: number) => {
    setHotspotsToAdd(hotspots);
  };

  const addHotspot = useCallback((newHotspots: Hotspot[]) => {
    setHotspots((prev) => {
      return [...newHotspots, ...prev];
    });
  }, []);

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
        hotspots,
        addHotspot,
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
