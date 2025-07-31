"use client";

import React, { useState } from "react";
import PlanNotSelected from "./plan-not-selected";
import PlanSelectedNotData from "./plan-selected-not-data";
import PlanSelectedWithData from "./plan-selected-with-data";
import { StripeSubscription } from "@/lib/interfaces/stripe";

type BillingStatus =
  | "plan-selected-not-data"
  | "plan-selected-with-data"
  | "plan-not-selected";

const Billing = ({
  subscription,
}: {
  subscription: StripeSubscription | null;
}) => {
  // change state to see the different states
  const [billingStatus] = useState<BillingStatus>("plan-selected-with-data");

  const renderBillingStatus = () => {
    switch (billingStatus) {
      case "plan-selected-not-data":
        return <PlanSelectedNotData />;
      case "plan-not-selected":
        return <PlanNotSelected />;
      case "plan-selected-with-data":
        return <PlanSelectedWithData />;
    }
  };

  return <div className="w-full">{renderBillingStatus()}</div>;
};

export default Billing;
