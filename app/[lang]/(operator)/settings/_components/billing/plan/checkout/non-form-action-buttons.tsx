import { Button } from "@heroui/react";
import { Steps } from "../../../billing-tab";
import { useBilling } from "../../../../contexts/BillingContext";
import { CustomerContext } from "../../../interfaces/billing-context";
import { calculateDiscountSummary } from "@/lib/helpers/stripe-helper";
import { useState } from "react";
import {
  createPaymentIntent,
  reactivateSubscription,
  updateHotspotAmountSubscription,
} from "@/lib/services/stripe-service";
import { addToast } from "@heroui/toast";
import moment from "moment";

interface Props {
  setSelected: (key: Steps) => void;
}

// available actions to render a pay label
const ACTIONS_TO_PAYMENT_LABEL: CustomerContext["action"][] = [
  "update_adding",
  "reactivate_adding",
];
const ACTIONS_TO_ACTIVATE_LABEL: CustomerContext["action"][] = [
  "reactivate_removing",
  "reactivating_not_checkout",
];

/**
 * This component return alternative buttons when the checkout form is not necessary
 * @returns
 */
export default function NonFormActionButtons({ setSelected }: Props) {
  const { customerContext, products, hotspotsToAdd, getProratedPrice } =
    useBilling();
  // STRIPE REMOVAL
  const product = products.find((product) => product.type === "hotspots");
  const productPriceDetails = product?.priceDetails[0];
  const productPriceNotFee = productPriceDetails?.price_without_fee ?? 0;
  const productPriceWithFee = productPriceDetails?.price_with_fee ?? 0;
  const currentHotspotsAmount = 0;
  const [isLoading, setIsLoading] = useState(false);
  const newHotspotsToAddAmount =
    currentHotspotsAmount > 0 && hotspotsToAdd > currentHotspotsAmount
      ? hotspotsToAdd - currentHotspotsAmount
      : 0;
  const daysUntilNextBilling = 0;
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
  });

  const totalPayment = priceToPay + fee;

  const getConfirmButtonText = () => {
    if (
      ACTIONS_TO_PAYMENT_LABEL.includes(customerContext?.action)
      //stripeSub?.status != "trialing"
    ) {
      return "Pay " + totalPayment?.toFixed(2);
    } else if (ACTIONS_TO_ACTIVATE_LABEL.includes(customerContext?.action)) {
      return "Activate subscription";
    } else {
      return "Update subscription";
    }
  };

  const updateSubscription = async () => {
    setIsLoading(true);
    if (customerContext?.action === "reactivating_not_checkout") {
      const result = true;
      if (!result) {
        addToast({
          title: "Error reactivating subscription",
          description: "result.message",
          color: "danger",
        });
      } else {
        //await refreshSubscriptionState();
        addToast({
          title: "Success",
          description: "refreshed subscription state",
          color: "success",
        });
        setSelected("step1");
      }
      return;
    }
    // user can update his subscription without paying only if trialing
    //if (stripeSub?.status === "trialing") {
    if (false) {
      const result = await updateHotspotAmountSubscription({
        quantity: hotspotsToAdd,
        basePrice: productPriceWithFee,
      });
      if (result.error) {
        addToast({
          title: "Error updating subscription",
          description: result.message,
          color: "danger",
        });
      } else {
        //await refreshSubscriptionState();
        addToast({
          title: "Success",
          description: result.message,
          color: "success",
        });
        setSelected("step1");
      }
    } else {
      const paymentIntent = await createPaymentIntent({
        amount_usd: Number(totalPayment?.toFixed(2)),
        metadata: {
          reason:
            "Unique payment for purchase of " +
            newHotspotsToAddAmount +
            " new hotspots" +
            moment().format("MMM DD, YYYY"),
          "New total hotspots": hotspotsToAdd,
          "Subscription id": "",
        },
        payment_method_id: "",
      });

      if (paymentIntent?.error) {
        addToast({
          title: "Error",
          description: paymentIntent?.message ?? "Internal stripe error",
          color: "danger",
        });
      } else {
        console.log("paymentIntent done", paymentIntent);
        await updateHotspotAmountSubscription({
          quantity: hotspotsToAdd,
          basePrice: productPriceWithFee,
        });
        //await refreshSubscriptionState();
        addToast({
          title: "Success",
          description: paymentIntent?.message ?? "Payment successfully",
          color: "success",
        });
        setSelected("step1");
      }
    }
    setIsLoading(false);
  };

  if (
    customerContext?.action === "activating" ||
    customerContext?.action === "reactivating_checkout" ||
    customerContext?.requiresPaymentMethod
  ) {
    return undefined;
  }

  return (
    <div className="flex flex-row gap-4 mt-3">
      <Button
        className="w-full mt-4"
        isDisabled={isLoading}
        onPress={() => setSelected("step2")}
      >
        Back
      </Button>
      <Button
        className="w-full mt-4"
        disabled={isLoading}
        isLoading={isLoading}
        onPress={() => updateSubscription()}
      >
        {isLoading ? "Processing" : getConfirmButtonText()}
      </Button>
    </div>
  );
}
