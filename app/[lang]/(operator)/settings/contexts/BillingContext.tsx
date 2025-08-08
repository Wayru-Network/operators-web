"use client";

import { StripeProduct } from "@/lib/interfaces/stripe";
import { createContext, useCallback, useContext, useState } from "react";
import { Hotspot } from "../../hotspots/_services/get-hotspots";

interface BillingProviderProps {
  children: React.ReactNode;
  products: StripeProduct[];
  hotspots: Hotspot[];
}

type BillingContextType = {
  products: StripeProduct[];
  hotspotsToAdd: number;
  handleHotspotsToAdd: (hotspots: number) => void;
  hotspots: Hotspot[];
  addHotspot: (h: Hotspot[]) => void;
};

const BillingContext = createContext<BillingContextType>({
  products: [],
  hotspotsToAdd: 0,
  handleHotspotsToAdd: () => {},
  hotspots: [],
  addHotspot: () => {},
});

export const BillingProvider = ({
  children,
  products,
  hotspots: hotspotsProps,
}: BillingProviderProps) => {
  const [hotspotsToAdd, setHotspotsToAdd] = useState(0);
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
        products,
        hotspotsToAdd,
        handleHotspotsToAdd,
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
