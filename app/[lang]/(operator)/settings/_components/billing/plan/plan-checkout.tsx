import React, { useState } from "react";
import { useBilling } from "@/app/[lang]/(operator)/settings/contexts/BillingContext";
import { Steps } from "../../billing-tab";
import { useCustomerSubscription } from "@/lib/contexts/customer-subscription-context";
import CheckoutBillingDetails from "./checkout-billing-details";
import { calculateDiscountSummary } from "@/lib/helpers/stripe-helper";
import { updateHotspotAmountSubscription } from "@/lib/services/stripe-service";
import { addToast } from "@heroui/toast";
import PaymentAndBillingMethod from "../payment-method/payment-and-billing-method";
import CheckoutForm from "./checkout/checkout-form";
import { Elements } from "@stripe/react-stripe-js";
import { stripeClient } from "@/lib/services/stripe-client-config";
import ProratedOneTimeDetails from "./checkout/prorated-one-time-details";
import NonFormActionButtons from "./checkout/non-form-action-buttons";

interface CheckoutFormProps {
  setSelected: (key: Steps) => void;
}

/**
 * Return a checkout for customer, conditional render depends on customer context
 */
export default function PlanCheckout({ setSelected }: CheckoutFormProps) {
  const { hotspotsToAdd, products, customerContext } = useBilling();
  const product = products.find((product) => product.type === "hotspots");
  const productPriceDetails = product?.priceDetails[0];
  const productPriceFee = productPriceDetails?.price_with_fee ?? 0;
  const productPriceNotFee = productPriceDetails?.price_without_fee ?? 0;
  const { subscription, refreshSubscriptionState } = useCustomerSubscription();
  const stripeSub = subscription?.stripe_subscription;
  const currentHotspotsAmount = stripeSub?.products_amount ?? 0;
  const [isLoading, setIsLoading] = useState(false);
  const summaryWithFee = calculateDiscountSummary(
    hotspotsToAdd,
    productPriceFee
  );
  const newHotspotsToAddAmount =
    currentHotspotsAmount > 0 && hotspotsToAdd > currentHotspotsAmount
      ? hotspotsToAdd - currentHotspotsAmount
      : 0;
  const summaryNotFee = calculateDiscountSummary(
    hotspotsToAdd,
    productPriceNotFee
  );
  const fee =
    summaryWithFee.totalPriceWithDiscount -
    summaryNotFee.unitPriceWithDiscount * hotspotsToAdd;

  const RenderPaymentBilling = () => {
    if (!customerContext?.requiresPaymentMethod) {
      return (
        <PaymentAndBillingMethod
          setSelected={setSelected}
          hideDeleteIcon
          hideButton
        />
      );
    } else if (customerContext?.requiresPaymentMethod) {
      return (
        <div className="flex flex-col w-full mt-3 gap-1">
          <p className="text-lg font-semibold w-full align-left">
            Add your payment method to complete your purchase.
          </p>
          <Elements stripe={stripeClient}>
            <CheckoutForm
              setSelected={setSelected}
              totalPrice={fee + 8.66}
              isRequired
              isUniquePayment={newHotspotsToAddAmount > 0}
            />
          </Elements>
        </div>
      );
    }
  };

  return (
    <div className=" flex flex-row gap-8 w-full">
      <div className="flex flex-col gap-3 w-full max-w-150">
        {/* Checkout details */}
        <div className="flex flex-col w-full">
          <p className="text-lg font-semibold w-full align-left">
            Please review the details of your plan and proceed to checkout.
          </p>
          <div className="flex flex-col w-full mt-3 ml-4 gap-2">
            <div className="flex flex-row">
              <p className="text-xs font-semibold">Number of hotspots:</p>
              <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
                {hotspotsToAdd}
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
                {(hotspotsToAdd * summaryNotFee.unitPriceWithDiscount).toFixed(
                  2
                )}
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
            <CheckoutBillingDetails setSelected={setSelected} />
            <ProratedOneTimeDetails />
          </div>
        </div>

        {/* Payment method */}
        <RenderPaymentBilling />
        {/* Render Action buttons if not need checkout form */}
        <NonFormActionButtons setSelected={setSelected} />
      </div>
    </div>
  );
}
