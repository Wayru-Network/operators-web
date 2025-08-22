import moment from "moment";
import { useBilling } from "../../../contexts/BillingContext";
import { Switch, Spinner } from "@heroui/react";
import { useCustomerSubscription } from "@/lib/contexts/customer-subscription-context";
import { CustomerSubscription } from "@/lib/interfaces/subscriptions";
import { useTransition } from "react";
import { Steps } from "../../billing-tab";
import { addToast } from "@heroui/toast";
import { createTrialSubscription } from "@/lib/services/stripe-service";
import { dateConstants } from "@/lib/constants/date";
import { formatMillisecondsToDate } from "@/lib/helpers/dates";

interface Props {
  setSelected: (key: Steps) => void;
}

export default function CheckoutBillingDetails({ setSelected }: Props) {
  const { products } = useBilling();
  const { formatDate } = dateConstants;
  const product = products.find((product) => product.type === "hotspots");
  const productPriceDetails = product?.priceDetails[0];
  const recurring = productPriceDetails?.recurring;
  const { subscription, refreshSubscriptionState } = useCustomerSubscription();
  const { hotspotsToAdd } = useBilling();
  const { is_trial_period_used } = subscription as CustomerSubscription;
  const stripeSub = subscription?.stripe_subscription;
  // get next billing date
  const nextBillingDate = stripeSub?.cancel_at
    ? formatMillisecondsToDate(stripeSub?.cancel_at)
    : stripeSub?.billing_details?.next_payment_date;

  // get next trial billing date
  const nextTrialBillingDate = moment().add(7, "days").format(formatDate);
  const [isLoading, startTransition] = useTransition();

  const onStartTrialPeriod = () => {
    startTransition(async () => {
      const response = await createTrialSubscription({
        price_id: productPriceDetails?.id || "",
        plan_id: product?.id || "",
        quantity: hotspotsToAdd,
        base_price_with_fee: productPriceDetails?.price_with_fee ?? 0,
      });
      if (response.error) {
        addToast({
          title: "Error",
          description: response.message,
          color: "danger",
        });
        return;
      }
      addToast({
        title: "Success",
        description: response.message,
        color: "default",
      });
      await refreshSubscriptionState();
      setSelected("step1");
    });
  };

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

  // if trial subscription was already used return only the next billing data!!
  if (is_trial_period_used) {
    return (
      <div className="flex flex-col w-full gap-2">
        <div className="flex flex-row">
          <p className="text-xs font-semibold">Billing cycle:</p>
          <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
            {getRecurringInterval(recurring?.interval ?? "month")}
          </p>
        </div>
        <div className="flex flex-row">
          <p className="text-xs font-semibold">Next billing date:</p>
          <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
            {nextBillingDate}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex flex-row">
        <p className="text-xs font-semibold">Trial period:</p>
        <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
          7 days
        </p>
      </div>
      <div className="flex flex-row">
        <p className="text-xs font-semibold">Trial period end:</p>
        <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
          {nextTrialBillingDate}
        </p>
      </div>
      <div className="flex flex-row">
        <p className="text-xs font-semibold">Next billing date:</p>
        <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
          {nextTrialBillingDate}
        </p>
      </div>
      <div className="flex flex-row items-center justify-between mt-[-4px]">
        <p className="text-xs font-semibold">Activate trial period:</p>
        {isLoading ? (
          <Spinner size="sm" />
        ) : (
          <Switch
            onValueChange={(e) => {
              if (e) {
                onStartTrialPeriod();
              }
            }}
            size="sm"
          />
        )}
      </div>
    </div>
  );
}
