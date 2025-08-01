"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlanNotSelected from "./Plan/plan-not-selected";
import SelectAPlan from "./Plan/select-a-plan";
import PlanActive from "./Plan/plan-active";
import { useBilling } from "../../contexts/BillingContext";
import PlanCheckout from "./Plan/plan-checkout";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";

const Billing = () => {
  const {
    billingStatus,
    changeBillingStatus,
    subscriptions,
    billingStatusHistory,
    goBack,
  } = useBilling();
  // change state to see the different states
  const hotspotSubscription = subscriptions.find(
    (subscription) =>
      subscription.type === "hotspots" &&
      (subscription.status === "active" || subscription.status === "trialing")
  );

  useEffect(() => {
    if (hotspotSubscription) {
      changeBillingStatus("plan-active");
    }
  }, [hotspotSubscription]);

  const renderBillingStatus = () => {
    switch (billingStatus) {
      case "plan-active":
        return <PlanActive />;
      case "select-a-plan":
        return <SelectAPlan />;
      case "plan-checkout":
        return <PlanCheckout />;
      default:
        return <PlanNotSelected />;
    }
  };

  return (
    <div className="w-full">
      {billingStatusHistory?.length > 1 &&
        billingStatus === "plan-checkout" && (
          <Breadcrumbs className="mb-4 mt-[-30px]">
            {billingStatusHistory.map(({ component, status }, index) => {
              const isPreviousStep = index === billingStatusHistory.length - 2;
              const isCurrentComponent = component === billingStatus;

              return (
                <BreadcrumbItem
                  key={component}
                  isDisabled={isCurrentComponent ? false : !isPreviousStep}
                  onPress={() => {
                    if (isPreviousStep) {
                      goBack();
                    }
                  }}
                  className={
                    isPreviousStep ? "cursor-pointer" : "cursor-not-allowed"
                  }
                >
                  {status}
                </BreadcrumbItem>
              );
            })}
          </Breadcrumbs>
        )}

      <AnimatePresence mode="wait">
        <motion.div
          key={billingStatus}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
        >
          {renderBillingStatus()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Billing;
