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
import {
  createCustomerSubscription,
  createPaymentIntent,
} from "@/lib/services/stripe-service";
import { PaymentIcon, PaymentType } from "react-svg-credit-card-payment-icons";
import { Button } from "@heroui/react";
import { LoadingInputWrapper } from "@/lib/components/loading-input-wrapper";
import { addToast } from "@heroui/toast";

interface CheckoutFormProps {
  setSelected: (key: Steps) => void;
  totalPrice: number | string;
  isRequired?: boolean;
  isUniquePayment?: boolean;
  newHotspotsAmount?: number;
}
export default function CheckoutForm({
  setSelected,
  totalPrice,
  isRequired,
  isUniquePayment,
  newHotspotsAmount,
}: CheckoutFormProps) {
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
  const [cardNumberComplete, setCardNumberComplete] = useState(false);
  const [cardExpiryComplete, setCardExpiryComplete] = useState(false);
  const [cardCvcComplete, setCardCvcComplete] = useState(false);
  const [isLoadingInputs, setIsLoadingInputs] = useState(true);

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
      // create a unique payment
      if (isUniquePayment) {
        const paymentIntent = await createPaymentIntent({
          amount_usd: Number(totalPrice),
          metadata: {
            reason:
              "Unique payment for purchase of " +
              newHotspotsAmount +
              " new hotspots",
          },
        });
        if (paymentIntent?.error || !paymentIntent.client_secret) {
          throw new Error(paymentIntent?.message);
        }
        // confirm payment intent
        const { error } = await stripe.confirmCardSetup(
          paymentIntent.client_secret,
          {
            payment_method: "Card",
          }
        );
        if (error) {
          setError(error.message || "Payment failed");
        } else {
          await refreshSubscriptionState();
          addToast({
            title: "Success",
            description: "",
          });
          setSelected("step1");
        }
      } else {
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
          {isLoading ? "Processing..." : `Pay $${totalPrice}`}
        </Button>
      </div>
    </form>
  );
}
