import React, { useState } from "react";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { stripe } from "@/app/[lang]/(operator)/settings/_services/stripe";
import { useBilling } from "@/app/[lang]/(operator)/settings/contexts/BillingContext";
import moment from "moment";
import { PaymentIcon } from "react-svg-credit-card-payment-icons";
import { CardBrand } from "@stripe/stripe-js";

export default function PlanCheckout() {
  const { hotspotsToAdd, products } = useBilling();
  const [cardBrand, setCardBrand] = useState<CardBrand | undefined>(undefined);
  const product = products.find((product) => product.type === "hotspots");
  const productPriceDetails = product?.priceDetails[0];
  const productPrice = productPriceDetails?.price ?? 0;
  const recurring = productPriceDetails?.recurring;
  const nextBillingDate = moment()
    .add(recurring?.interval_count ?? 1, recurring?.interval ?? "month")
    .format("MMM D, YYYY");

  const totalPrice = hotspotsToAdd * productPrice;

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
            <div className="flex flex-col gap-4 w-full">
              {/* Card number on top */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-2">Card number</label>
                <div className="relative">
                  <CardNumberElement
                    className="p-3 border border-gray-300 rounded-md pl-14"
                    options={{
                      disableLink: true,
                      placeholder: "1234 1234 1234 1234",
                    }}
                    onChange={(event) => {
                      setCardBrand(event.brand);
                    }}
                  />
                  {cardBrand && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <PaymentIcon
                        type={cardBrand}
                        format="logo"
                        className="mr-2"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* CVC and expiry below */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2">
                    Expiry date
                  </label>
                  <CardExpiryElement
                    className="p-3 border border-gray-300 rounded-md"
                    options={{
                      placeholder: "MM/YY",
                    }}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2">CVC</label>
                  <CardCvcElement
                    className="p-3 border border-gray-300 rounded-md"
                    options={{
                      placeholder: "123",
                    }}
                  />
                </div>
              </div>
            </div>
          </Elements>
        </div>
      </div>
    </div>
  );
}
