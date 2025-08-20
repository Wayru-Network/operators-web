import React, { useState } from "react";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@heroui/button";
import { PaymentIcon, PaymentType } from "react-svg-credit-card-payment-icons";
import { useTheme } from "next-themes";
import {
  changePaymentMethod,
  confirmChangePaymentMethod,
} from "@/lib/services/stripe-service";
import { CardBrand } from "@stripe/stripe-js";
import { stripeClient } from "@/lib/services/stripe-client-config";
import { Steps } from "../../billing-tab";
import { addToast } from "@heroui/toast";
import { useCustomerSubscription } from "@/lib/contexts/customer-subscription-context";
import { Spinner } from "@heroui/react";

interface CheckoutFormProps {
  setSelected: (key: Steps) => void;
}

interface CheckoutFormProps {
  setSelected: (key: Steps) => void;
}

function ChangePaymentForm({ setSelected }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { theme } = useTheme();
  const { subscription, refreshSubscriptionState } = useCustomerSubscription();
  const [cardBrand, setCardBrand] = useState<CardBrand | undefined>("unknown");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const paymentMethod = subscription?.stripe_subscription?.payment_method;
  const [isLoadingInputs, setLoadingInput] = useState(true);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Create subscription on backend
      const setupIntent = await changePaymentMethod(
        subscription?.stripe_subscription?.subscription_id || ""
      );

      if (!setupIntent?.client_secret) {
        throw new Error("No payment intent client secret received");
      }

      // Confirm the card setup for the subscription
      const { error: confirmError } = await stripe.confirmCardSetup(
        setupIntent.client_secret,
        {
          payment_method: {
            card: elements.getElement(CardNumberElement)!,
            billing_details: {
              // Add billing details if needed
            },
          },
        }
      );

      if (confirmError) {
        setError(confirmError.message || "Payment failed");
      } else {
        // Payment successful
        const result = await confirmChangePaymentMethod(
          setupIntent.setup_intent_id
        );
        if (result?.success) {
          // Refresh the subscription data
          await refreshSubscriptionState();
        }
        addToast({
          title: "Success",
          description: "New payment method added",
          color: "default",
        });
        setSelected("step1");
      }
    } catch (err) {
      console.error("change payment method error", err);
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setIsLoading(false);
    }
  };

  const SpinnerActive = () => (
    <div className="absolute right-1.5">
      <Spinner size="sm" />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      {/* Card number on top */}
      <div className="flex flex-col mt-5">
        <label className="text-xs font-medium mb-2">Card number</label>
        <div className="relative w-full">
          <div className="flex flex-row w-full relative items-center">
            <CardNumberElement
              className="p-3 border border-gray-300 rounded-md pl-10 w-full h-11"
              onReady={() => setLoadingInput(false)}
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
              }}
            />
            {isLoadingInputs && <SpinnerActive />}
          </div>
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <PaymentIcon
              type={cardBrand as PaymentType}
              format="logo"
              className="mr-2"
              width={25}
              height={25}
            />
          </div>
        </div>
      </div>

      {/* CVC and expiry below */}
      <div className="flex gap-4 mt-3">
        <div className="flex-1">
          <label className="text-xs font-medium mb-2">Expiry date</label>
          <div className="flex flex-row w-full relative items-center">
            <CardExpiryElement
              className="p-3 border border-gray-300 rounded-md w-full h-11"
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
            />
            {isLoadingInputs && <SpinnerActive />}
          </div>
        </div>
        <div className="flex-1">
          <label className="text-xs font-medium mb-2">CVC</label>
          <div className="flex flex-row w-full relative items-center">
            <CardCvcElement
              className="p-3 border border-gray-300 rounded-md w-full h-11"
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
            {isLoadingInputs && <SpinnerActive />}
          </div>
        </div>
      </div>

      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      <div className="flex flex-row gap-4">
        <Button
          type="button"
          className="w-full mt-4 w-1/2"
          onPress={() => setSelected("step1")}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className={`w-full mt-4 w-1/2 ${
            isLoading || isLoadingInputs
              ? "cursor-not-allowed"
              : "cursor-pointer"
          } `}
          disabled={isLoading || isLoadingInputs}
          isLoading={isLoading}
        >
          {isLoading ? "Processing..." : paymentMethod ? `Change` : "Add"}
        </Button>
      </div>
    </form>
  );
}

interface ChangePaymentMethodProps {
  setSelected: (key: Steps) => void;
}

export default function ChangePaymentMethod({
  setSelected,
}: ChangePaymentMethodProps) {
  return (
    <div className=" flex flex-row gap-8 w-full">
      <div className="flex flex-col gap-3 md:w-full lg:w-1/2">
        {/* Checkout details */}
        <div className="flex flex-col w-full">
          <p className="text-lg font-semibold w-full align-left">
            Add your new payment method.
          </p>
        </div>
        <Elements stripe={stripeClient}>
          <ChangePaymentForm setSelected={setSelected} />
        </Elements>
      </div>
    </div>
  );
}
