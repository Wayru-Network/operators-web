import React from "react";
import { useBilling } from "@/app/[lang]/(operator)/settings/contexts/BillingContext";
import { Steps } from "../../billing-tab";
import CheckoutBillingDetails from "./checkout-billing-details";
import { calculateDiscountSummary } from "@/lib/helpers/stripe-helper";

import CheckoutForm from "./checkout/checkout-form";
import ProratedOneTimeDetails from "./checkout/prorated-one-time-details";
import NonFormActionButtons from "./checkout/non-form-action-buttons";

interface CheckoutFormProps {
  setSelected: (key: Steps) => void;
}

/**
 * Return a checkout for customer, conditional render depends on customer context
 */
export default function PlanCheckout({ setSelected }: CheckoutFormProps) {
  const { hotspotsToAdd, pricings } = useBilling();
  const summaryWithFee = calculateDiscountSummary(
    hotspotsToAdd,
    (pricings?.plans[0].base_price_cents ?? 0) / 100
  );
  const summaryNotFee = calculateDiscountSummary(
    hotspotsToAdd,
    (pricings?.plans[0].base_price_cents ?? 0) / 100
  );
  const fee =
    summaryWithFee.totalPriceWithDiscount -
    summaryNotFee.unitPriceWithDiscount * hotspotsToAdd;

  const RenderPaymentBilling = () => {
    return (
      <div className="flex flex-col w-full mt-3 gap-1">
        <p className="text-lg font-semibold w-full align-left">
          Add your payment method to complete your purchase.
        </p>
        <CheckoutForm setSelected={setSelected} isRequired />
      </div>
    );
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
                SOLANA?? ${fee.toFixed(2)}
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
