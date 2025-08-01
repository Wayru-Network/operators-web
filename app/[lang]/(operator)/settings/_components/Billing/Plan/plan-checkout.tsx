import React, { useState } from "react";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { stripe } from "@/app/[lang]/(operator)/settings/_services/stripe";
import { useBilling } from "@/app/[lang]/(operator)/settings/contexts/BillingContext";
import moment from "moment";
import { PaymentIcon, PaymentType } from "react-svg-credit-card-payment-icons";
import { CardBrand } from "@stripe/stripe-js";
import { useTheme } from "next-themes";
import { Button } from "@heroui/button";
import {
  createStripeSubscription,
  confirmSubscription,
} from "@/lib/services/stripe-service";

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { theme } = useTheme();
  const { hotspotsToAdd, products, changeBillingStatus } = useBilling();
  const [cardBrand, setCardBrand] = useState<CardBrand | undefined>("unknown");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const product = products.find((product) => product.type === "hotspots");
  const productPriceDetails = product?.priceDetails[0];
  const productPrice = productPriceDetails?.price ?? 0;
  const totalPrice = hotspotsToAdd * productPrice;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create subscription on backend
      const subscription = await createStripeSubscription({
        price_id: productPriceDetails?.id || "",
        plan_id: product?.id || "",
        quantity: hotspotsToAdd,
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
        await confirmSubscription(subscription.subscription_id);
        changeBillingStatus("plan-active");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      {/* Card number on top */}
      <div className="flex flex-col">
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
      <div className="flex gap-4">
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

      <Button
        type="submit"
        className="w-full mt-4"
        disabled={isLoading || !stripe}
        isLoading={isLoading}
      >
        {isLoading ? "Processing..." : `Pay $${totalPrice}`}
      </Button>
    </form>
  );
}

export default function PlanCheckout() {
  const { hotspotsToAdd, products } = useBilling();
  const product = products.find((product) => product.type === "hotspots");
  const productPriceDetails = product?.priceDetails[0];
  const productPrice = productPriceDetails?.price ?? 0;
  const recurring = productPriceDetails?.recurring;
  const nextBillingDate = moment()
    .add(recurring?.interval_count ?? 1, recurring?.interval ?? "month")
    .format("MMM D, YYYY");

  const totalPrice = hotspotsToAdd * productPrice;
  const { theme } = useTheme();

  const getRecurringInterval = (interval: string) => {
    switch (interval) {
      case "month":
        return "Monthly";
      case "year":
        return "Yearly";
      default:
        return "Monthly";
    }
  };

  return (
    <div className=" flex flex-row gap-8 w-full">
      <div className="flex flex-col gap-3  w-1/2">
        {/* Checkout details */}
        <div className="flex flex-col w-full">
          <p className="text-base font-semibold w-full align-left">Checkout</p>
          <p className="text-sm ml-4 mt-2 font-medium">
            Please review the details of your plan and proceed to checkout.
          </p>
          <div className="flex flex-col w-full mt-3 ml-4 gap-1">
            <div className="flex flex-row">
              <p className="text-xs font-semibold">Number of hotspots:</p>
              <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
                {hotspotsToAdd}
              </p>
            </div>
            <div className="flex flex-row">
              <p className="text-xs font-semibold">Billing cycle:</p>
              <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
                {getRecurringInterval(recurring?.interval ?? "month")}
              </p>
            </div>
            <div className="flex flex-row">
              <p className="text-xs font-semibold">Price per hotspot:</p>
              <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
                ${productPrice}
              </p>
            </div>
            <div className="flex flex-row">
              <p className="text-xs font-semibold">Total monthly cost:</p>
              <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
                ${totalPrice}
              </p>
            </div>
            <div className="flex flex-row">
              <p className="text-xs font-semibold">Next billing date:</p>
              <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
                {nextBillingDate}
              </p>
            </div>
          </div>
        </div>
        {/* Payment method */}
        <div className="flex flex-col ml-4 w-full mt-3 gap-1">
          <p className="text-sm mt-2 mb-3 font-medium">
            Add your payment method to complete your purchase.
          </p>
          <Elements stripe={stripe}>
            <CheckoutForm />
          </Elements>
        </div>
      </div>
    </div>
  );
}
