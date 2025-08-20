import { useCustomerSubscription } from "@/lib/contexts/customer-subscription-context";
import { useBilling } from "../../../../contexts/BillingContext";
import { calculateDiscountSummary } from "@/lib/helpers/stripe-helper";
import Stripe from "stripe";
import moment from "moment";
import { Button } from "@heroui/button";
import { Steps } from "../../../billing-tab";

interface Props {
  setSelected: (key: Steps) => void;
  openCancelModal: () => void;
}
export default function PlanActiveDetails({
  setSelected,
  openCancelModal,
}: Props) {
  const { subscription } = useCustomerSubscription();
  const hotspotSubscription = subscription?.stripe_subscription;
  const products_amount = hotspotSubscription?.products_amount ?? 0;
  const { handleHotspotsToAdd, products } = useBilling();
  const product = products.find((product) => product.type === "hotspots");
  const productPriceDetails = product?.priceDetails[0];
  const productPriceFee = productPriceDetails?.price_with_fee ?? 0;
  const productPriceNotFee = productPriceDetails?.price_without_fee ?? 0;
  const summaryWithFee = calculateDiscountSummary(
    products_amount,
    productPriceFee
  );
  const summaryNotFee = calculateDiscountSummary(
    products_amount,
    productPriceNotFee
  );
  const fee =
    summaryWithFee.totalPriceWithDiscount -
    summaryNotFee.unitPriceWithDiscount * products_amount;

  const billingCycle = (interval: Stripe.Price.Recurring.Interval) => {
    if (interval === "month") {
      return "Monthly";
    } else if (interval === "year") {
      return "Yearly";
    }
    return "Monthly";
  };

  return (
    <div className="flex flex-col w-full">
      <p className="text-base font-semibold w-full align-left ">
        Subscription for your hotspots
      </p>
      <div className="flex flex-col w-full mt-2 ml-4 gap-1">
        <div className="flex flex-row">
          <p className="text-xs font-semibold">Number of hotspots:</p>
          <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
            {products_amount}
          </p>
        </div>
        <div className="flex flex-row">
          <p className="text-xs font-semibold">Price per hotspot:</p>
          <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
            ${summaryNotFee.unitPriceWithDiscount}
          </p>
        </div>
        <div className="flex flex-row">
          <p className="text-xs font-semibold">Sub total:</p>
          <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
            $
            {(products_amount * summaryNotFee.unitPriceWithDiscount).toFixed(2)}
          </p>
        </div>
        <div className="flex flex-row">
          <p className="text-xs font-semibold">Fee:</p>
          <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
            ${fee.toFixed(2)}
          </p>
        </div>
        <div className="flex flex-row">
          <p className="text-xs font-semibold">Total monthly cost:</p>
          <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
            ${summaryWithFee.totalPriceWithDiscount.toFixed(2)}
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
        {moment().isBefore(
          moment((hotspotSubscription?.trial_period_end || 0) * 1000)
        ) && (
          <div className="flex flex-row">
            <p className="text-xs font-semibold">Trial period:</p>
            <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
              {moment(
                Number(hotspotSubscription?.trial_period_start) * 1000
              ).format("MMM DD, YYYY")}{" "}
              -{" "}
              {moment(
                Number(hotspotSubscription?.trial_period_end) * 1000
              ).format("MMM DD, YYYY")}
            </p>
          </div>
        )}
        <div className="flex flex-row">
          <p className="text-xs font-semibold">Next billing date:</p>
          <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
            {hotspotSubscription?.billing_details?.next_payment_date || "N/A"}
          </p>
        </div>
      </div>
      <div className="flex flex-row w-full justify-start mt-3">
        <Button
          onPress={() => {
            handleHotspotsToAdd(products_amount ?? 0);
            setSelected("step2");
          }}
          className="w-1/2 bg-[#000] dark:bg-[#fff] text-white dark:text-black"
        >
          Adjust plan
        </Button>
        <Button
          className="w-1/2 bg-[#fff] dark:bg-[#000] text-black dark:text-white ml-2 border border-gray-400 dark:border-gray-700"
          onPress={openCancelModal}
        >
          Cancel plan
        </Button>
      </div>
    </div>
  );
}
