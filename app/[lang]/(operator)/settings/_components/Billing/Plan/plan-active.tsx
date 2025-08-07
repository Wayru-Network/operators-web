import { Button, Tooltip } from "@heroui/react";
import { ArrowDownToLine, Trash2 } from "lucide-react";
import { PaymentIcon, PaymentType } from "react-svg-credit-card-payment-icons";
import { useBilling } from "../../../contexts/BillingContext";
import moment from "moment";
import Stripe from "stripe";
import { Steps } from "../Billing";
import "./plan.css";
import AssignPlanHotspots from "./assign-plan-hotspots";

interface PlanActiveProps {
  setSelected: (key: Steps) => void;
}

const PlanActive = ({ setSelected }: PlanActiveProps) => {
  const { subscriptions } = useBilling();
  const hotspotSubscription = subscriptions.find(
    (subscription) => subscription.type === "hotspots"
  );

  const isDisabledDeletePaymentMethod = true;
  const currentMonth = moment().format("MMMM");
  const currentYear = moment().format("YYYY");

  const billingCycle = (interval: Stripe.Price.Recurring.Interval) => {
    if (interval === "month") {
      return "Monthly";
    } else if (interval === "year") {
      return "Yearly";
    }
    return "Monthly";
  };

  return (
    <div className=" flex flex-row gap-8 w-full">
      {/* Left side */}
      <div className="flex flex-col gap-3 w-1/2">
        <div className="flex flex-col items-center max-w-96 ">
          {/* Subscription for your hotspots section */}
          <div className="flex flex-col w-full">
            <p className="text-base font-semibold w-full align-left ">
              Subscription for your hotspots
            </p>
            <div className="flex flex-col w-full mt-2 ml-4 gap-1">
              <div className="flex flex-row">
                <p className="text-xs font-semibold">Number of hotspots:</p>
                <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
                  {hotspotSubscription?.products_amount}
                </p>
              </div>
              <div className="flex flex-row">
                <p className="text-xs font-semibold">Billing cycle:</p>
                <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
                  {billingCycle(
                    hotspotSubscription?.billing_details
                      ?.interval as Stripe.Price.Recurring.Interval
                  )}
                </p>
              </div>
              <div className="flex flex-row">
                <p className="text-xs font-semibold">Price per hotspot:</p>
                <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
                  ${hotspotSubscription?.billing_details?.amount}
                </p>
              </div>
              <div className="flex flex-row">
                <p className="text-xs font-semibold">Total monthly cost:</p>
                <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
                  $
                  {(hotspotSubscription?.billing_details?.amount || 0) *
                    (hotspotSubscription?.products_amount || 0)}
                </p>
              </div>
              {moment().isBefore(
                moment(
                  (hotspotSubscription?.last_invoice?.period_end || 0) * 1000
                ).add(1, "day")
              ) && (
                <div className="flex flex-row">
                  <p className="text-xs font-semibold">Trial period:</p>
                  <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
                    {moment(
                      Number(hotspotSubscription?.last_invoice?.period_start) *
                        1000
                    ).format("MMM DD, YYYY")}{" "}
                    -{" "}
                    {moment(
                      Number(hotspotSubscription?.last_invoice?.period_end) *
                        1000
                    )
                      .add(1, "day")
                      .format("MMM DD, YYYY")}
                  </p>
                </div>
              )}
              <div className="flex flex-row">
                <p className="text-xs font-semibold">Next billing date:</p>
                <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
                  {hotspotSubscription?.billing_details?.next_payment_date ||
                    "N/A"}
                </p>
              </div>
            </div>
            <div className="flex flex-row w-full justify-start mt-3">
              <Button className="w-1/2 bg-[#000] dark:bg-[#fff] text-white dark:text-black">
                Adjust plan
              </Button>
              <Button className="w-1/2 bg-[#fff] dark:bg-[#000] text-black dark:text-white ml-2 border border-gray-400 dark:border-gray-700">
                Cancel plan
              </Button>
            </div>
          </div>

          {/* Invoice history section */}
          <div className="flex flex-col w-full mt-2">
            <p className="text-base font-semibold w-full align-left mt-6">
              Invoice history
            </p>
            <div className="flex flex-row w-full items-center gap-4 ml-4 mt-2 justify-between">
              <div>
                <p className="text-xs  font-small">
                  {hotspotSubscription?.products_amount} hotspots - Monthly Plan
                </p>
                <p className="text-lg  font-medium">
                  {currentMonth} {currentYear}
                </p>
              </div>
              <ArrowDownToLine size={22} className="cursor-pointer mr-4" />
            </div>
          </div>

          {/* Payment & billing methods section */}
          <div className="flex flex-col w-full mt-2">
            <p className="text-base font-semibold w-full align-left mt-6">
              Payment & billing methods
            </p>
            <div className="flex flex-row gap-3 mt-2 items-center w-full"></div>
            <div className="flex flex-row w-full">
              <div className="flex flex-row w-full ml-4 items-center">
                <PaymentIcon
                  type={
                    hotspotSubscription?.payment_method?.card
                      ?.brand as PaymentType
                  }
                  format="logo"
                  className="mr-2"
                />
                <div>
                  <p className="text-sm  font-medium">
                    {hotspotSubscription?.payment_method?.card?.brand
                      ?.toLowerCase()
                      .replace(/^\w/, (c: string) => c.toUpperCase())}{" "}
                    **** {hotspotSubscription?.payment_method?.card?.last4}
                  </p>
                  <p className="text-xs  font-normal">
                    Expires{" "}
                    {moment(
                      Number(
                        hotspotSubscription?.payment_method?.card?.exp_month
                      ) * 1000
                    ).format("MMM DD, YYYY")}
                  </p>
                </div>
              </div>
              <Tooltip
                isDisabled={!isDisabledDeletePaymentMethod}
                content="You can't delete your card while you have active plans."
                placement="right"
              >
                <Trash2
                  onClick={() => {
                    if (isDisabledDeletePaymentMethod) {
                      console.log("disabled delete payment method");
                      return;
                    }
                  }}
                  size={22}
                  className={`${
                    isDisabledDeletePaymentMethod
                      ? "text-gray-400"
                      : "dark:text-[#ffffff] text-[#000000] cursor-pointer "
                  }`}
                />
              </Tooltip>
            </div>
          </div>

          <Button
            onPress={() => setSelected("step3")}
            className="w-full bg-[#000] dark:bg-[#fff] text-white dark:text-black mt-9"
          >
            Change
          </Button>
        </div>
      </div>

      {/* Right side */}
      <AssignPlanHotspots />
    </div>
  );
};

export default PlanActive;
