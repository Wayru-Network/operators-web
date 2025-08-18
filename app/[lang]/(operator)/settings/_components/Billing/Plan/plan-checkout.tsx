import React, { useState } from "react";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { stripeClient } from "@/lib/services/stripe-client-config";
import { useBilling } from "@/app/[lang]/(operator)/settings/contexts/BillingContext";
import { PaymentIcon, PaymentType } from "react-svg-credit-card-payment-icons";
import { CardBrand } from "@stripe/stripe-js";
import { useTheme } from "next-themes";
import { Button } from "@heroui/button";
import { Steps } from "../Billing";
import { useCustomerSubscription } from "@/lib/contexts/customer-subscription-context";
import CheckoutBillingDetails from "./checkout-billing-details";
import { calculateDiscountSummary } from "@/lib/helpers/stripe-helper";
import {
  createCustomerSubscription,
  updateHotspotAmountSubscription,
} from "@/lib/services/stripe-service";
import { addToast } from "@heroui/toast";
import PaymentAndBillingMethod from "../payment-method/payment-and-billing-method";

interface CheckoutFormProps {
  setSelected: (key: Steps) => void;
}

function CheckoutForm({ setSelected }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { theme } = useTheme();
  const { hotspotsToAdd, products } = useBilling();
  const { refreshSubscriptionState } = useCustomerSubscription();
  const [cardBrand, setCardBrand] = useState<CardBrand | undefined>("unknown");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const product = products.find((product) => product.type === "hotspots");
  const productPriceDetails = product?.priceDetails[0];
  const productPriceFee = productPriceDetails?.price_with_fee ?? 0;
  const totalPrice = hotspotsToAdd * productPriceFee;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create subscription on backend
      const subscription = await createCustomerSubscription({
        price_id: productPriceDetails?.id || "",
        plan_id: product?.id || "",
        quantity: hotspotsToAdd,
        base_price_with_fee: productPriceFee,
      });

      if (!subscription?.payment_intent_client_secret) {
        throw new Error("No payment intent client secret received");
      }

      // Confirm the card setup for the subscription
      const { error: confirmError } = await stripe.confirmCardSetup(
        subscription.payment_intent_client_secret,
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
        const sub = await refreshSubscriptionState();
        if (!sub?.stripe_subscription?.payment_method) {
          // if there is not payment method try to refresh again
          await refreshSubscriptionState();
        }
        setSelected("step1");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full ml-4">
      {/* Card number on top */}
      <div className="flex flex-col mt-5">
        <label className="text-xs font-medium mb-2">Card number</label>
        <div className="relative">
          <CardNumberElement
            className="p-3 border border-gray-300 rounded-md pl-10"
            options={{
              disableLink: true,
              placeholder: "1234 1234 1234 1234",
              style: {
                base: {
                  color: theme === "dark" ? "#ffffff" : "#000000",
                  fontSize: "16px",
                },
              },
            }}
            onChange={(event) => {
              setCardBrand(event.brand);
            }}
          />

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
          <CardExpiryElement
            className="p-3 border border-gray-300 rounded-md"
            options={{
              placeholder: "MM/YY",
              style: {
                base: {
                  color: theme === "dark" ? "#ffffff" : "#000000",
                  fontSize: "16px",
                },
              },
            }}
          />
        </div>
        <div className="flex-1">
          <label className="text-xs font-medium mb-2">CVC</label>
          <CardCvcElement
            className="p-3 border border-gray-300 rounded-md"
            options={{
              placeholder: "123",
              style: {
                base: {
                  color: theme === "dark" ? "#ffffff" : "#000000",
                  fontSize: "16px",
                },
              },
            }}
          />
        </div>
      </div>

      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

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
          {isLoading ? "Processing..." : `Pay $${totalPrice}`}
        </Button>
      </div>
    </form>
  );
}

export default function PlanCheckout({ setSelected }: CheckoutFormProps) {
  const { hotspotsToAdd, products } = useBilling();
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
  const summaryNotFee = calculateDiscountSummary(
    hotspotsToAdd,
    productPriceNotFee
  );
  const fee =
    summaryWithFee.totalPriceWithDiscount -
    summaryNotFee.unitPriceWithDiscount * hotspotsToAdd;

  const updateSubscription = async () => {
    setIsLoading(true);
    const result = await updateHotspotAmountSubscription({
      quantity: hotspotsToAdd,
      basePrice: productPriceFee,
    });
    if (result.error) {
      addToast({
        title: "Error updating subscription",
        description: result.message,
        color: "danger",
      });
    } else {
      await refreshSubscriptionState();
      addToast({
        title: "Subscription updated",
        description: result.message,
        color: "default",
      });
      setSelected("step1");
    }
    setIsLoading(false);
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
          </div>
        </div>

        {/* Payment method */}
        {currentHotspotsAmount > 0 ? (
          <PaymentAndBillingMethod
            setSelected={setSelected}
            notShowDeleteIcon
            notShowBtn
          />
        ) : (
          <div className="flex flex-col w-full mt-3 gap-1">
            <p className="text-lg font-semibold w-full align-left">
              Add your payment method to complete your purchase.
            </p>
            <Elements stripe={stripeClient}>
              <CheckoutForm setSelected={setSelected} />
            </Elements>
          </div>
        )}

        {currentHotspotsAmount > 0 && (
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
              onPress={updateSubscription}
            >
              {isLoading ? "Updating" : "Update subscription"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
