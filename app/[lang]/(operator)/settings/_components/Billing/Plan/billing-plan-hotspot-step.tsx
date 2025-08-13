"use client";

import { Button, Tooltip } from "@heroui/react";
import { Minus, Plus } from "lucide-react";
import { useBilling } from "../../../contexts/BillingContext";
import PlanNotFound from "./plan-not-found";
import { Steps } from "../Billing";
import { useCustomerSubscription } from "@/lib/contexts/customer-subscription-context";
import { updateCustomerSubscription } from "@/app/api/subscriptions/_services/subscriptions-service";
import { useTransition } from "react";
import { addToast } from "@heroui/toast";
import { useSubscriptionHotspots } from "@/lib/hooks/use-hotspots";

interface SelectAPlanProps {
  setSelected: (key: Steps) => void;
}

const BillingPlanHotspotsStep = ({ setSelected }: SelectAPlanProps) => {
  const { products, handleHotspotsToAdd, hotspotsToAdd } = useBilling();
  const hotspotProduct = products.find(
    (product) => product.type === "hotspots"
  );
  const { subscription, refreshSubscriptionState } = useCustomerSubscription();
  const stripeSub = subscription?.stripe_subscription;
  const currentHotspotsAmount = stripeSub?.products_amount ?? 0;
  const hotspotPrice = hotspotProduct?.priceDetails[0].price ?? 0;
  const monthlyCost = hotspotPrice * currentHotspotsAmount;
  const newMonthlyCost =
    currentHotspotsAmount !== hotspotsToAdd ? hotspotPrice * hotspotsToAdd : 0;
  const [isUpdatingSubscription, startUpdatingSubscription] = useTransition();
  const { hotspots: assignedHotspots } = useSubscriptionHotspots();
  const assignedHotspotsAmount = assignedHotspots?.length;

  const handleHotspotsCountChange = (type: "add" | "remove") => {
    if (type === "add") {
      handleHotspotsToAdd(hotspotsToAdd + 1);
    } else if (
      type === "remove" &&
      hotspotsToAdd > 0 &&
      assignedHotspotsAmount < hotspotsToAdd
    ) {
      handleHotspotsToAdd(hotspotsToAdd - 1);
    }
  };

  const handleNextStep = () => {
    // if the current prod amt is greater thant 0 is because user wants to update the sub
    if (currentHotspotsAmount > 0) {
      startUpdatingSubscription(async () => {
        const result = await updateCustomerSubscription({
          quantity: hotspotsToAdd,
        });
        if (result.error) {
          addToast({
            title: "Error updating subscription",
            description: result.message,
            color: "danger",
          });
        } else {
          await refreshSubscriptionState();
          addToast({
            title: "Subscription updated",
            description: result.message,
            color: "default",
          });
          setSelected("step1");
        }
      });
    } else {
      setSelected("step4");
    }
  };

  if (!hotspotProduct) {
    return <PlanNotFound />;
  }

  return (
    <div className=" flex flex-row gap-8 w-full ">
      {/* Left side */}
      <div className="flex flex-col gap-3 w-1/2">
        <div className="flex flex-col items-center">
          {/* Current plan section */}
          <div className="flex flex-col w-full">
            <p className="text-lg font-semibold w-full align-left ">
              Current plan
            </p>
            <div className="flex flex-col w-full mt-2 ml-4">
              <div className="flex flex-row">
                <p className="text-xs font-semibold">Active hotspots:</p>
                <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
                  {currentHotspotsAmount}
                </p>
              </div>
              <div className="flex flex-row">
                <p className="text-xs font-semibold">Monthly cost:</p>
                <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
                  ${monthlyCost}
                </p>
              </div>
            </div>
          </div>

          {/* Add or remove hotspots section */}
          <div className="flex flex-col w-full mt-2">
            <p className="text-lg font-semibold w-full align-left mt-6">
              Add or remove hotspots
            </p>
            <div className="flex flex-row w-full items-center gap-4 ml-4 mt-2 justify-between max-w-20">
              <Tooltip
                isDisabled={assignedHotspotsAmount < hotspotsToAdd}
                content={
                  "You must remove hotspots from your plan if you want to reduce the amount"
                }
              >
                <Minus
                  size={16}
                  className={
                    assignedHotspotsAmount >= hotspotsToAdd
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  }
                  onClick={() => handleHotspotsCountChange("remove")}
                />
              </Tooltip>
              <p className="text-xs w-7 font-medium text-center">
                {hotspotsToAdd}
              </p>
              <Plus
                size={16}
                className="cursor-pointer"
                onClick={() => handleHotspotsCountChange("add")}
              />
            </div>
          </div>

          {/* New plan review section */}
          <div className="flex flex-col w-full mt-2">
            <p className="text-lg font-semibold w-full align-left mt-6">
              New plan review
            </p>
            <div className="flex flex-row gap-3 mt-2 items-center w-full"></div>
            <div className="flex flex-row w-full">
              <div className="flex flex-col w-full ml-4">
                <div className="flex flex-row">
                  <p className="text-xs  font-semibold">New monthly cost:</p>
                  <p className="text-xs  font-medium ml-1 dark:text-gray-300 text-gray-700">
                    ${newMonthlyCost.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <Button
            className="w-full bg-[#000] dark:bg-[#fff] text-white dark:text-black mt-9 disabled:opacity-50 disabled:cursor-not-allowed w-1/2"
            disabled={isUpdatingSubscription}
            onPress={() => setSelected("step1")}
          >
            Back
          </Button>
          <Button
            isLoading={isUpdatingSubscription}
            disabled={
              hotspotsToAdd === currentHotspotsAmount || isUpdatingSubscription
            }
            className="w-full bg-[#000] dark:bg-[#fff] text-white dark:text-black mt-9 disabled:opacity-50 disabled:cursor-not-allowed w-1/2"
            onPress={() => handleNextStep()}
          >
            {currentHotspotsAmount
              ? isUpdatingSubscription
                ? "Updating Subscription"
                : "Update subscription"
              : "Proceed to checkout"}
          </Button>
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-col gap-3 items-center w-1/2 justify-self-end"></div>
    </div>
  );
};

export default BillingPlanHotspotsStep;
