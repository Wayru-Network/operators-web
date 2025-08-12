"use client";

import React, { useState } from "react";
import PlanNotSelected from "./Plan/plan-not-selected";
import SelectAPlan from "./Plan/select-a-plan";
import PlanActive from "./Plan/plan-active";
import PlanCheckout from "./Plan/plan-checkout";
import ChangePaymentMethod from "./payment-method/change-payment-method";
import { Tab, Tabs } from "@heroui/tabs";
import EaseInOutContent from "@/lib/components/ease-in-out-content";
import { Spinner } from "@heroui/react";
import { useCustomerSubscription } from "@/lib/contexts/customer-subscription-context";

export type Steps = "step1" | "step2" | "step3" | "step4";
const Billing = () => {
  const { subscription, isGettingSubscription } = useCustomerSubscription();
  const [selected, setSelected] = useState<Steps>("step1");
  const stripeSubscription = subscription?.stripe_subscription;

  if (isGettingSubscription) {
    return (
      <div className="w-full flex flew-col justify-center align-items">
        <div className="flex flex-col ">
          <p className="text-lg w-full mb-8 font-semibold">Loading..</p>
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <Tabs
      classNames={{
        tabList: "!hidden",
        panel: "p-0 min-h-full mt-[-20px]",
      }}
      selectedKey={selected}
      onSelectionChange={(key) => setSelected(key as Steps)}
    >
      <Tab key="step1" title="My subscriptions">
        <EaseInOutContent>
          {stripeSubscription ? (
            <PlanActive setSelected={setSelected} />
          ) : (
            <PlanNotSelected setSelected={setSelected} />
          )}
        </EaseInOutContent>
      </Tab>
      <Tab key="step2" title="Billing">
        <EaseInOutContent>
          <SelectAPlan setSelected={setSelected} />
        </EaseInOutContent>
      </Tab>
      <Tab key="step3" title="Change payment method">
        <EaseInOutContent>
          <ChangePaymentMethod setSelected={setSelected} />
        </EaseInOutContent>
      </Tab>
      <Tab key="step4" title="Checkout">
        <EaseInOutContent>
          <PlanCheckout setSelected={setSelected} />
        </EaseInOutContent>
      </Tab>
    </Tabs>
  );
};

export default Billing;
