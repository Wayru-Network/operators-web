import { useCustomerSubscription } from "@/lib/contexts/customer-subscription-context";
import { useBilling } from "../../../../contexts/BillingContext";
import { calculateDiscountSummary } from "@/lib/helpers/stripe-helper";

export default function ProratedOneTimeDetails() {
  const { hotspotsToAdd, products, getProratedPrice } = useBilling();
  const { subscription } = useCustomerSubscription();
  const product = products.find((product) => product.type === "hotspots");
  const productPriceDetails = product?.priceDetails[0];
  const stripeSub = subscription?.stripe_subscription;
  const productPriceNotFee = productPriceDetails?.price_without_fee ?? 0;
  const productPriceWithFee = productPriceDetails?.price_with_fee ?? 0;
  const currentHotspotsAmount = stripeSub?.products_amount ?? 0;
  const newHotspotsToAddAmount =
    currentHotspotsAmount > 0 && hotspotsToAdd > currentHotspotsAmount
      ? hotspotsToAdd - currentHotspotsAmount
      : 0;
  const daysUntilNextBilling =
    stripeSub?.billing_details?.days_until_next_billing ?? 0;
  const summaryNotFee = calculateDiscountSummary(
    newHotspotsToAddAmount,
    productPriceNotFee
  );
  const summaryWithFee = calculateDiscountSummary(
    newHotspotsToAddAmount,
    productPriceWithFee
  );
  const fee =
    summaryWithFee.totalPriceWithDiscount -
    summaryNotFee.unitPriceWithDiscount * newHotspotsToAddAmount;
  const priceToPay = getProratedPrice({
    unitPrice: summaryNotFee?.unitPriceWithDiscount,
    daysUntilNextBilling,
    newHotspotsToAddAmount,
  });

  const totalPayment = priceToPay + fee;

  if (newHotspotsToAddAmount === 0 || stripeSub?.status === "trialing")
    return undefined;

  return (
    <div className="flex flex-col">
      <p className="text-xs font-semibold">Prorated one-time charge:</p>
      <p className="text-xs font-medium ml-1 dark:text-gray-300 text-gray-700 mt-1">
        You are adding <strong>{newHotspotsToAddAmount}</strong> hotspot
        {newHotspotsToAddAmount > 1 ? "s" : ""}. Since your next billing date is{" "}
        <strong>{stripeSub?.billing_details?.next_payment_date}</strong>, you'll
        be charged a one-time prorated fee for the remaining{" "}
        <strong>{daysUntilNextBilling} days</strong> of this cycle.
      </p>
      <p className="text-xs font-medium ml-1 dark:text-gray-300 text-gray-700 mt-1">
        Each hotspot costs{" "}
        <strong>${summaryNotFee?.unitPriceWithDiscount}/month</strong>, so you
        will pay <strong>${priceToPay.toFixed(2)}</strong> for the remaining
        days, plus a ${fee.toFixed(2)} fee.{" "}
        <strong>Total: {totalPayment.toFixed(2)}</strong>
      </p>
    </div>
  );
}
