import { Button, Tooltip } from "@heroui/react";
import { ArrowDownToLine, Trash2 } from "lucide-react";
import { PaymentIcon, PaymentType } from "react-svg-credit-card-payment-icons";
import moment from "moment";
import Stripe from "stripe";
import { Steps } from "../Billing";
import AssignPlanHotspots from "./assign-plan-hotspots";
import { useCustomerSubscription } from "@/lib/contexts/customer-subscription-context";
import { useBilling } from "../../../contexts/BillingContext";
import { calculateDiscountSummary } from "@/lib/helpers/stripe-helper";

interface PlanActiveProps {
  setSelected: (key: Steps) => void;
}

const PlanActive = ({ setSelected }: PlanActiveProps) => {
  const { subscription } = useCustomerSubscription();
  const hotspotSubscription = subscription?.stripe_subscription;
  const paymentMethod = hotspotSubscription?.payment_method;
  const latestInvoice = hotspotSubscription?.latest_invoice;
  const { handleHotspotsToAdd, products } = useBilling();
  const isDisabledDeletePaymentMethod = !latestInvoice;
  const invoiceCreatedAt = latestInvoice?.createdAt ?? 0;
  const currentMonth = moment(invoiceCreatedAt * 1000).format("MMMM");
  const currentYear = moment(invoiceCreatedAt * 1000).format("YYYY");
  const product = products.find((product) => product.type === "hotspots");
  const productPriceDetails = product?.priceDetails[0];
  const products_amount = hotspotSubscription?.products_amount ?? 0;
  const { unitPriceWithDiscount, totalPriceWithDiscount } =
    calculateDiscountSummary(
      products_amount,
      productPriceDetails?.price_with_fee ?? 0
    );

  const billingCycle = (interval: Stripe.Price.Recurring.Interval) => {
    if (interval === "month") {
      return "Monthly";
    } else if (interval === "year") {
      return "Yearly";
    }
    return "Monthly";
  };

  return (
    <div className=" flex flex-row gap-8 w-full">
      {/* Left side */}
      <div className="flex flex-col gap-3 w-1/2">
        <div className="flex flex-col items-center max-w-96 ">
          {/* Subscription for your hotspots section */}
          <div className="flex flex-col w-full">
            <p className="text-base font-semibold w-full align-left ">
              Subscription for your hotspots
            </p>
            <div className="flex flex-col w-full mt-2 ml-4 gap-1">
              <div className="flex flex-row">
                <p className="text-xs font-semibold">Number of hotspots:</p>
                <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
                  {products_amount}
                </p>
              </div>
              <div className="flex flex-row">
                <p className="text-xs font-semibold">Billing cycle:</p>
                <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
                  {billingCycle(
                    hotspotSubscription?.billing_details
                      ?.interval as Stripe.Price.Recurring.Interval
                  )}
                </p>
              </div>
              <div className="flex flex-row">
                <p className="text-xs font-semibold">Price per hotspot:</p>
                <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
                  ${unitPriceWithDiscount.toFixed(2)}
                </p>
              </div>
              <div className="flex flex-row">
                <p className="text-xs font-semibold">Total monthly cost:</p>
                <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
                  ${totalPriceWithDiscount.toFixed(2)}
                </p>
              </div>
              {moment().isBefore(
                moment((hotspotSubscription?.trial_period_end || 0) * 1000)
              ) && (
                <div className="flex flex-row">
                  <p className="text-xs font-semibold">Trial period:</p>
                  <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
                    {moment(
                      Number(hotspotSubscription?.trial_period_start) * 1000
                    ).format("MMM DD, YYYY")}{" "}
                    -{" "}
                    {moment(
                      Number(hotspotSubscription?.trial_period_end) * 1000
                    ).format("MMM DD, YYYY")}
                  </p>
                </div>
              )}
              <div className="flex flex-row">
                <p className="text-xs font-semibold">Next billing date:</p>
                <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
                  {hotspotSubscription?.billing_details?.next_payment_date ||
                    "N/A"}
                </p>
              </div>
            </div>
            <div className="flex flex-row w-full justify-start mt-3">
              <Button
                onPress={() => {
                  handleHotspotsToAdd(products_amount ?? 0);
                  setSelected("step2");
                }}
                className="w-1/2 bg-[#000] dark:bg-[#fff] text-white dark:text-black"
              >
                Adjust plan
              </Button>
              <Button className="w-1/2 bg-[#fff] dark:bg-[#000] text-black dark:text-white ml-2 border border-gray-400 dark:border-gray-700">
                Cancel plan
              </Button>
            </div>
          </div>

          {/* Invoice history section */}
          <div className="flex flex-col w-full mt-2">
            <p className="text-base font-semibold w-full align-left mt-6">
              Invoice history
            </p>
            {latestInvoice ? (
              <div className="flex flex-row w-full items-center gap-4 ml-4 mt-2 justify-between">
                <div>
                  <p className="text-xs  font-small">
                    {hotspotSubscription?.products_amount} hotspots - Monthly
                    Plan
                  </p>
                  <p className="text-lg  font-medium">
                    {currentMonth} {currentYear}
                  </p>
                </div>
                <ArrowDownToLine
                  onClick={() =>
                    window.open(latestInvoice?.invoice_pdf, "_blank")
                  }
                  size={22}
                  className="cursor-pointer mr-4"
                />
              </div>
            ) : (
              <div className="flex flex-row w-full items-center gap-4 ml-4 mt-2 justify-between">
                <p className="text-lg  font-medium">N/A</p>
              </div>
            )}
          </div>

          {/* Payment & billing methods section */}
          <div className="flex flex-col w-full mt-2">
            <p className="text-base font-semibold w-full align-left mt-6">
              Payment & billing methods
            </p>
            <div className="flex flex-row gap-3 mt-2 items-center w-full"></div>
            <div className="flex flex-row w-full">
              <div className="flex flex-row w-full ml-4 items-center">
                <PaymentIcon
                  type={paymentMethod?.brand as PaymentType}
                  format="logo"
                  className="mr-2"
                />
                <div>
                  <p className="text-sm  font-medium">
                    {paymentMethod?.brand
                      ?.toLowerCase()
                      .replace(/^\w/, (c: string) => c.toUpperCase())}{" "}
                    **** {paymentMethod?.last4}
                  </p>
                  {paymentMethod ? (
                    <p className="text-xs  font-normal">
                      Expires{" "}
                      {moment(Number(paymentMethod?.exp_month) * 1000).format(
                        "MMM DD, YYYY"
                      )}
                    </p>
                  ) : (
                    <p className="text-xs  font-normal">
                      Payment method not added
                    </p>
                  )}
                </div>
              </div>
              {paymentMethod && (
                <Tooltip
                  isDisabled={!isDisabledDeletePaymentMethod}
                  content="You can't delete your card while you have active plans."
                  placement="right"
                >
                  <Trash2
                    onClick={() => {
                      if (isDisabledDeletePaymentMethod) {
                        console.log("disabled delete payment method");
                        return;
                      }
                    }}
                    size={22}
                    className={`${
                      isDisabledDeletePaymentMethod
                        ? "text-gray-400"
                        : "dark:text-[#ffffff] text-[#000000] cursor-pointer "
                    }`}
                  />
                </Tooltip>
              )}
            </div>
          </div>

          <Button
            onPress={() => setSelected("step3")}
            className="w-full bg-[#000] dark:bg-[#fff] text-white dark:text-black mt-9"
          >
            {paymentMethod ? "Change Payment Method" : "Add Payment Method"}
          </Button>
        </div>
      </div>

      {/* Right side */}
      <AssignPlanHotspots />
    </div>
  );
};

export default PlanActive;
