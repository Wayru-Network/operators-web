"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { Hotspot } from "../../hotspots/_services/get-hotspots";
import {
  BillingContextType,
  BillingProviderProps,
  CustomerAction,
  CustomerContext,
  GetProratedPrice,
  HotspotChange,
  SubscriptionStatus,
} from "../_components/interfaces/billing-context";

const BillingContext = createContext<BillingContextType | null>(null);

export const BillingProvider = ({
  children,
  products,
  hotspots: hotspotsProps,
}: BillingProviderProps) => {
  const [hotspotsToAdd, setHotspotsToAdd] = useState(0);
  const [hotspots, setHotspots] = useState(hotspotsProps);
  // STRIPE REMOVAL
  // const { subscription } = useCustomerSubscription();
  // const stripeSubscription = subscription?.stripe_subscription;
  //const currentHotspotsAmount = stripeSubscription?.products_amount ?? 0;
  const newHotspotsToAddAmount =
    1 > 0 && hotspotsToAdd > 1 ? hotspotsToAdd - 1 : 0;

  const handleHotspotsToAdd = (hotspots: number) => {
    setHotspotsToAdd(hotspots);
  };

  const addHotspot = useCallback((newHotspots: Hotspot[]) => {
    setHotspots((prev) => {
      return [...newHotspots, ...prev];
    });
  }, []);

  const getCustomerContext = (): CustomerContext => {
    const currentHotspotsAmount = 0;
    const hasHotspots = currentHotspotsAmount > 0;
    const isSame = hotspotsToAdd === currentHotspotsAmount;
    const isAdding = hotspotsToAdd > currentHotspotsAmount;
    const isRemoving = hotspotsToAdd < currentHotspotsAmount;
    const status = "active";

    const isCanceling = false;
    const isExpired = isCanceling && status !== "active";
    const hasPaymentMethod = true;

    let subscriptionStatus: SubscriptionStatus = "active";
    if (isCanceling) subscriptionStatus = isExpired ? "expired" : "canceling";

    let hotspotChange: HotspotChange = "same";
    if (isAdding) hotspotChange = "adding";
    if (isRemoving) hotspotChange = "removing";

    let action: CustomerAction = "activating";

    if (hasHotspots) {
      if (isAdding) {
        action = isCanceling ? "reactivate_adding" : "update_adding";
      } else if (isRemoving) {
        action = isCanceling ? "reactivate_removing" : "update_removing";
      } else if (isSame && isCanceling) {
        action = isExpired
          ? "reactivating_checkout"
          : "reactivating_not_checkout";
      }
    }

    const requiresPaymentMethod =
      // If user is reactivating a cancelled subscription, always require payment method
      (action === "reactivating_checkout" ||
        action === "reactivate_adding" ||
        action === "reactivate_removing" ||
        action === "reactivating_not_checkout") &&
      !hasPaymentMethod
        ? true
        : // Checkout is required unless removing with active subscription
          !(subscriptionStatus === "active" && isRemoving) && !hasPaymentMethod;

    return {
      action,
      subscriptionStatus,
      hotspotChange,
      requiresPaymentMethod,
    };
  };

  const getProratedPrice = ({
    unitPrice,
    daysUntilNextBilling,
  }: GetProratedPrice) => {
    return (unitPrice / 30) * daysUntilNextBilling * 1;
  };

  return (
    <BillingContext.Provider
      value={{
        products,
        hotspotsToAdd,
        handleHotspotsToAdd,
        hotspots,
        addHotspot,
        customerContext: getCustomerContext(),
        getProratedPrice,
        newHotspotsToAddAmount,
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
