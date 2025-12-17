import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Steps } from "../../../billing-tab";
import { useTheme } from "next-themes";
import { useBilling } from "../../../../contexts/BillingContext";
import { useCustomerSubscription } from "@/lib/contexts/customer-subscription-context";
import { useState } from "react";
import { CardBrand } from "@stripe/stripe-js";
import { PaymentIcon, PaymentType } from "react-svg-credit-card-payment-icons";
import { Button } from "@heroui/react";
import { LoadingInputWrapper } from "@/lib/components/loading-input-wrapper";
import { addToast } from "@heroui/toast";
import { calculateDiscountSummary } from "@/lib/helpers/stripe-helper";

interface CheckoutFormProps {
  setSelected: (key: Steps) => void;
  isRequired?: boolean;
}
export default function CheckoutForm({
  setSelected,
  isRequired,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { theme } = useTheme();
  const {
    hotspotsToAdd,
    pricings,
    customerContext,
    newHotspotsToAddAmount,
    getProratedPrice,
  } = useBilling();
  const { subscription } = useCustomerSubscription();
  const stripeSub = subscription?.stripe_subscription;
  const [cardBrand, setCardBrand] = useState<CardBrand | undefined>("unknown");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const productPriceFee = (pricings?.plans[0].base_price_cents ?? 0) / 100;
  const productPriceNotFee = (pricings?.plans[0].base_price_cents ?? 0) / 100;
  const [cardNumberComplete, setCardNumberComplete] = useState(false);
  const [cardExpiryComplete, setCardExpiryComplete] = useState(false);
  const [cardCvcComplete, setCardCvcComplete] = useState(false);
  const [isLoadingInputs, setIsLoadingInputs] = useState(true);
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
    daysUntilNextBilling:
      stripeSub?.billing_details?.days_until_next_billing ?? 0,
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

    if (!stripe || !elements) {
      return;
    }

    if (isRequired) {
      if (!cardNumberComplete || !cardExpiryComplete || !cardCvcComplete) {
        setError("Please complete all fields");
        setIsLoading(false);
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
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
      <div className="flex flex-col mt-5 ml-4">
        <label className="text-xs font-medium mb-2">Card number</label>
        <div className="relative w-full">
          <LoadingInputWrapper
            isLoading={isLoadingInputs}
            startContent={
              <PaymentIcon
                type={cardBrand as PaymentType}
                format="logo"
                className="mr-2"
                width={25}
                height={25}
              />
            }
          >
            <CardNumberElement
              className="p-3 border border-gray-300 rounded-md pl-10 w-full"
              onReady={() => setIsLoadingInputs(false)}
              options={{
                disableLink: true,
                placeholder: "1234 1234 1234 1234",
                style: {
                  base: {
                    color: theme === "dark" ? "#ffffff" : "#000000",
                    fontSize: "16px",
                  },
                },
                disabled: isLoadingInputs,
              }}
              onChange={(event) => {
                setCardBrand(event.brand);
                setCardNumberComplete(event.complete);
              }}
            />
          </LoadingInputWrapper>
        </div>
      </div>

      {/* CVC and expiry below */}
      <div className="flex gap-4 mt-3 ml-4">
        <div className="flex-1">
          <label className="text-xs font-medium mb-2">Expiry date</label>
          <LoadingInputWrapper isLoading={isLoadingInputs}>
            <CardExpiryElement
              className="p-3 border border-gray-300 rounded-md w-full"
              options={{
                placeholder: "MM/YY",
                style: {
                  base: {
                    color: theme === "dark" ? "#ffffff" : "#000000",
                    fontSize: "16px",
                  },
                },
                disabled: isLoadingInputs,
              }}
              onChange={(e) => {
                setCardExpiryComplete(e.complete);
              }}
            />
          </LoadingInputWrapper>
        </div>
        <div className="flex-1">
          <label className="text-xs font-medium mb-2">CVC</label>
          <LoadingInputWrapper isLoading={isLoadingInputs}>
            <CardCvcElement
              className="p-3 border border-gray-300 rounded-md w-full"
              onChange={(e) => {
                setCardCvcComplete(e.complete);
              }}
              options={{
                placeholder: "123",
                style: {
                  base: {
                    color: theme === "dark" ? "#ffffff" : "#000000",
                    fontSize: "16px",
                  },
                },
                disabled: isLoadingInputs,
              }}
            />
          </LoadingInputWrapper>
        </div>
      </div>

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
          disabled={isLoading || !stripe}
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
