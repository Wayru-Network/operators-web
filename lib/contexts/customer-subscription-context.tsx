"use client";

import { createContext, useContext, ReactNode, useCallback } from "react";
import { CustomerSubscription } from "@/lib/interfaces/subscriptions";
import { useSubscription } from "../hooks/use-subscription";

interface CustomerSubscriptionContextType {
  isGettingSubscription: boolean;
  subscription: CustomerSubscription | undefined;
  refreshSubscriptionState: () => Promise<CustomerSubscription | undefined>;
}

const CustomerSubscriptionContext = createContext<
  CustomerSubscriptionContextType | undefined
>(undefined);

interface CustomerSubscriptionProviderProps {
  children: ReactNode;
}

export function CustomerSubscriptionProvider({
  children,
}: CustomerSubscriptionProviderProps) {
  const { isLoading, subscription, refreshSubscriptions } = useSubscription();

  const refreshSubscriptionState = useCallback(async () => {
    const sub = await refreshSubscriptions();
    return sub?.subscription;
  }, [refreshSubscriptions]);

  // context value
  const value: CustomerSubscriptionContextType = {
    isGettingSubscription: isLoading,
    subscription,
    refreshSubscriptionState,
  };

  return (
    <CustomerSubscriptionContext.Provider value={value}>
      {children}
    </CustomerSubscriptionContext.Provider>
  );
}

export function useCustomerSubscription() {
  const context = useContext(CustomerSubscriptionContext);

  if (context === undefined) {
    throw new Error(
      "useCustomerSubscription must be used within a CustomerSubscriptionProvider"
    );
  }

  return context;
}
