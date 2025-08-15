import { useCustomerSubscription } from "@/lib/contexts/customer-subscription-context";
import { Button } from "@heroui/react";
import { Tooltip } from "@heroui/tooltip";
import { Trash2 } from "lucide-react";
import moment from "moment";
import { PaymentIcon, PaymentType } from "react-svg-credit-card-payment-icons";
import { Steps } from "../Billing";

interface PlanActiveProps {
  setSelected: (key: Steps) => void;
  notShowDeleteIcon?: boolean;
  notShowUpdatePaymentBtn?: boolean;
}
export default function PaymentAndBillingMethod({
  setSelected,
  notShowDeleteIcon,
  notShowUpdatePaymentBtn,
}: PlanActiveProps) {
  const { subscription } = useCustomerSubscription();
  const hotspotSubscription = subscription?.stripe_subscription;
  const latestInvoice = hotspotSubscription?.latest_invoice;
  const isDisabledDeletePaymentMethod = !latestInvoice;
  const paymentMethod = hotspotSubscription?.payment_method;

  return (
    <div className="w-full">
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
                <p className="text-xs  font-normal">Payment method not added</p>
              )}
            </div>
          </div>
          {paymentMethod && !notShowDeleteIcon && (
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

      {!notShowUpdatePaymentBtn && (
        <Button
          onPress={() => setSelected("step3")}
          className="w-full bg-[#000] dark:bg-[#fff] text-white dark:text-black mt-9"
        >
          {paymentMethod ? "Change Payment Method" : "Add Payment Method"}
        </Button>
      )}
    </div>
  );
}
