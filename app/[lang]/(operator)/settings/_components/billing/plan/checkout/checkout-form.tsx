import { Steps } from "../../../billing-tab";
import { useBilling } from "../../../../contexts/BillingContext";
import { useState } from "react";
import { Button } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { calculateDiscountSummary } from "@/lib/helpers/stripe-helper";
import { createInitialSubscription } from "@/lib/services/subscription-service";

interface CheckoutFormProps {
  setSelected: (key: Steps) => void;
  isRequired?: boolean;
}
export default function CheckoutForm({ setSelected }: CheckoutFormProps) {
  const {
    hotspotsToAdd,
    pricings,
    customerContext,
    newHotspotsToAddAmount,
    getProratedPrice,
  } = useBilling();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const productPriceFee = (pricings?.plans[0].base_price_cents ?? 0) / 100;
  const productPriceNotFee = (pricings?.plans[0].base_price_cents ?? 0) / 100;
  const summaryWithFee = calculateDiscountSummary(
    hotspotsToAdd,
    productPriceFee
  );
  const summaryNotFee = calculateDiscountSummary(
    newHotspotsToAddAmount,
    productPriceNotFee
  );
  const priceToPay = getProratedPrice({
    unitPrice: summaryNotFee?.unitPriceWithDiscount,
    daysUntilNextBilling: 0,
  });
  // get the prorated fee and payment
  const proratedFee =
    summaryWithFee.totalPriceWithDiscount -
    summaryNotFee.unitPriceWithDiscount * newHotspotsToAddAmount;
  const proratedPayment = priceToPay + proratedFee;

  // total payment var
  const totalToPay =
    customerContext?.action === "activating"
      ? summaryWithFee.totalPriceWithDiscount
      : proratedPayment;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const planId = pricings?.plans[0].id;
      if (!planId) {
        throw new Error("Plan ID is not available");
      }
      const result = await createInitialSubscription({
        planId,
        hotspotLimit: hotspotsToAdd,
        expiryDate: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        ),
      });
      if (!result) {
        throw new Error("Subscription creation failed");
      }
      addToast({
        title: "Success",
        description: "Subscription reactivated",
        color: "success",
      });
      setSelected("step1");
      return;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      {/* Card number on top */}
      {/* <div className="flex flex-col mt-5 ml-4">
        <label className="text-xs font-medium mb-2">Card number</label>
        <div className="relative w-full"></div>
      </div> */}

      {/* CVC and expiry below */}
      {/* <div className="flex gap-4 mt-3 ml-4">
        <div className="flex-1">
          <label className="text-xs font-medium mb-2">Expiry date</label>
        </div>
        <div className="flex-1">
          <label className="text-xs font-medium mb-2">CVC</label>
        </div>
      </div> */}

      {error && <div className="text-red-500 text-sm mt-0">{error}</div>}

      <div className="flex flex-row gap-4">
        <Button
          type="submit"
          className="w-full mt-4"
          isDisabled={isLoading}
          onPress={() => setSelected("step2")}
        >
          Back
        </Button>
        <Button
          type="submit"
          className="w-full mt-4"
          disabled={isLoading}
          isLoading={isLoading}
        >
          {isLoading
            ? "Processing..."
            : customerContext?.action === "reactivating_not_checkout"
            ? "Reactivate subscription"
            : `Pay $${Number(totalToPay).toFixed(2)}`}
        </Button>
      </div>
    </form>
  );
}
