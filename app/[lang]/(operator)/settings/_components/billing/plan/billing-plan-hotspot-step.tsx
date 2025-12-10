"use client";

import { Button, Tooltip } from "@heroui/react";
import { Minus, Plus } from "lucide-react";
import { useBilling } from "../../../contexts/BillingContext";
import PlanNotFound from "./plan-not-found";
import { Steps } from "../../billing-tab";
import { useSubscriptionHotspots } from "@/lib/hooks/use-hotspots";
import { calculateDiscountSummary } from "@/lib/helpers/stripe-helper";
import { AnimatePresence, motion } from "framer-motion";

interface SelectAPlanProps {
  setSelected: (key: Steps) => void;
}

const BillingPlanHotspotsStep = ({ setSelected }: SelectAPlanProps) => {
  const { products, handleHotspotsToAdd, hotspotsToAdd } = useBilling();
  const hotspotProduct = products.find(
    (product) => product.type === "hotspots"
  );
  // STRIPE REMOVAL
  const hotspotPriceWithFee =
    hotspotProduct?.priceDetails[0].price_with_fee ?? 0;
  // const { totalPriceWithDiscount: currentMonthlyCost } =
  //   calculateDiscountSummary(currentHotspotsAmount, hotspotPriceWithFee);
  const { hotspots: assignedHotspots } = useSubscriptionHotspots();
  const assignedHotspotsAmount = assignedHotspots?.length;
  const { totalPriceWithDiscount } = calculateDiscountSummary(
    hotspotsToAdd,
    hotspotPriceWithFee
  );
  const isNewMonthlyCost = 0 != hotspotsToAdd;
  const isButtonDisabled = () => {
    // switch (true) {
    //   case !!stripeSub?.cancel_at && stripeSub?.status != "canceled":
    //     return false;
    //   case currentHotspotsAmount > 0:
    //     return hotspotsToAdd === currentHotspotsAmount;
    //   case hotspotsToAdd <= 0:
    //     return true;
    //   default:
    //     return false;
    // }
    return false;
  };
  const newHotspotsToAddAmount =
    0 > 0 && hotspotsToAdd > 0 ? hotspotsToAdd - 0 : 0;
  const hotspotsToRemoveAmount =
    0 > 0 && hotspotsToAdd < 0 ? 0 - hotspotsToAdd : 0;

  const handleHotspotsCountChange = (type: "add" | "remove") => {
    const hotspotsToRemove = hotspotsToAdd - 1;
    if (type === "add") {
      handleHotspotsToAdd(hotspotsToAdd + 1);
    } else if (
      type === "remove" &&
      hotspotsToAdd > 0 &&
      assignedHotspotsAmount < hotspotsToAdd &&
      hotspotsToRemove >= 1
    ) {
      handleHotspotsToAdd(hotspotsToRemove);
    }
  };

  // STRIPE REMOVAL
  // if (!hotspotProduct) {
  //   return <PlanNotFound />;
  // }

  return (
    <div className=" flex flex-row gap-8 w-full">
      <div className="flex flex-col gap-3 md:w-full lg:w-1/2">
        <div className="flex flex-col items-center w-full">
          {/* Current plan section */}
          <div className="flex flex-col w-full">
            <p className="text-lg font-semibold w-full align-left ">
              Current plan
            </p>
            <div className="flex flex-col w-full mt-2 ml-4 gap-1">
              <div className="flex flex-row">
                <p className="text-xs font-semibold">Active hotspots:</p>
                <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
                  {0}
                </p>
              </div>
              <div className="flex flex-row">
                <p className="text-xs font-semibold">Monthly cost:</p>
                <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
                  ${0}
                </p>
              </div>
              {true && (
                <div className="flex flex-row">
                  <p className="text-xs font-semibold">Status:</p>
                  <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
                    cancelled
                  </p>
                </div>
              )}
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
              <div className="flex flex-col w-full ml-4 gap-1">
                <AnimatePresence>
                  {false ? (
                    <motion.div
                      key="reason-details"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                      className="gap-2"
                    >
                      <div className="flex flex-col w-full gap-1">
                        <div className="flex flex-row">
                          <p className="text-xs  font-semibold">
                            Current Activate hotspot:
                          </p>
                          <p className="text-xs  font-medium ml-1 dark:text-gray-300 text-gray-700">
                            {0}{" "}
                          </p>
                        </div>
                        <div className="flex flex-row">
                          <p className="text-xs  font-semibold">
                            Hotspots to{" "}
                            {newHotspotsToAddAmount > 0 ? "add" : "remove"}:
                          </p>
                          <p className="text-xs  font-medium ml-1 dark:text-gray-300 text-gray-700">
                            {newHotspotsToAddAmount > 0
                              ? newHotspotsToAddAmount
                              : hotspotsToRemoveAmount}
                          </p>
                        </div>
                        <div className="flex flex-row">
                          <p className="text-xs  font-semibold">
                            Total hotspots:
                          </p>
                          <p className="text-xs  font-medium ml-1 dark:text-gray-300 text-gray-700">
                            {hotspotsToAdd > 0
                              ? 0 + (hotspotsToAdd - 0)
                              : 0 - (0 - hotspotsToAdd)}
                          </p>
                        </div>
                        <div className="flex flex-row">
                          <p className="text-xs  font-semibold">
                            New monthly cost:
                          </p>
                          <p className="text-xs  font-medium ml-1 dark:text-gray-300 text-gray-700">
                            $
                            {isNewMonthlyCost
                              ? totalPriceWithDiscount.toFixed(2)
                              : 0}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex flex-row">
                      <p className="text-xs  font-semibold">
                        New monthly cost:
                      </p>
                      <p className="text-xs  font-medium ml-1 dark:text-gray-300 text-gray-700">
                        $
                        {isNewMonthlyCost
                          ? totalPriceWithDiscount.toFixed(2)
                          : 0}
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <Button
            className="bg-[#000] dark:bg-[#fff] text-white dark:text-black mt-9 disabled:opacity-50 disabled:cursor-not-allowed w-1/2"
            onPress={() => setSelected("step1")}
          >
            Back
          </Button>
          <Button
            disabled={isButtonDisabled()}
            className="bg-[#000] dark:bg-[#fff] text-white dark:text-black mt-9 disabled:opacity-50 disabled:cursor-not-allowed w-1/2"
            onPress={() => setSelected("step4")}
          >
            Proceed to checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BillingPlanHotspotsStep;
