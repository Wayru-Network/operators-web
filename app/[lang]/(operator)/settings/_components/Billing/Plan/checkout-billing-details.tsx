import moment from "moment";
import { useBilling } from "../../../contexts/BillingContext";
import { Switch, Spinner } from "@heroui/react";
import { useCustomerSubscription } from "@/lib/contexts/customer-subscription-context";
import { CustomerSubscription } from "@/lib/interfaces/subscriptions";
import { createTrialSubscription } from "@/app/api/subscriptions/_services/subscriptions-service";
import { useTransition } from "react";
import { Steps } from "../Billing";
import { addToast } from "@heroui/toast";

interface Props {
  setSelected: (key: Steps) => void;
}

export default function CheckoutBillingDetails({ setSelected }: Props) {
  const { products } = useBilling();
  const product = products.find((product) => product.type === "hotspots");
  const productPriceDetails = product?.priceDetails[0];
  const recurring = productPriceDetails?.recurring;
  const { subscription, refreshSubscriptionState } = useCustomerSubscription();
  const { hotspotsToAdd } = useBilling();
  const { is_trial_period_used } = subscription as CustomerSubscription;
  const nextBillingDate = moment()
    .add(recurring?.interval_count ?? 1, recurring?.interval ?? "month")
    .format("MMM D, YYYY");
  const nextTrialBillingDate = moment().add(7, "days").format("MMM DD, YYYY");
  const [isLoading, startTransition] = useTransition();

  const onStartTrialPeriod = () => {
    startTransition(async () => {
      const response = await createTrialSubscription({
        price_id: productPriceDetails?.id || "",
        plan_id: product?.id || "",
        quantity: hotspotsToAdd,
      });
      if (response.error) {
        addToast({
          title: "subscription not created",
          description: response.message,
          color: "danger",
        });
        return;
      }
      addToast({
        title: "subscription created",
        description: response.message,
        color: "default",
      });
      await refreshSubscriptionState();
      setSelected("step1");
      console.log("response", response);
    });
  };

  // if trial subscription was already used return only the next billing data!!
  if (is_trial_period_used) {
    return (
      <div className="flex flex-row">
        <p className="text-xs font-semibold">Next billing date:</p>
        <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
          {nextBillingDate}
        </p>
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
