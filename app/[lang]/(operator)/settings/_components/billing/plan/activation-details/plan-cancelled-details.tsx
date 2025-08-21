import { useCustomerSubscription } from "@/lib/contexts/customer-subscription-context";
import { Button } from "@heroui/button";
import { Steps } from "../../../billing-tab";
import { useBilling } from "../../../../contexts/BillingContext";
import { formatMillisecondsToDate } from "@/lib/helpers/dates";

interface Props {
  setSelected: (key: Steps) => void;
}
export default function PlanCancelledDetails({ setSelected }: Props) {
  const { subscription } = useCustomerSubscription();
  const { handleHotspotsToAdd } = useBilling();
  const hotspotSubscription = subscription?.stripe_subscription;
  const cancelAt = hotspotSubscription?.cancel_at;

  return (
    <div className="flex flex-col w-full">
      <p className="text-base font-semibold w-full align-left ">
        Subscription for your hotspots
      </p>
      <div className="flex flex-col w-full mt-6 ml-4 gap-1">
        <div className="flex flex-col">
          <p className="text-xs font-bold dark:text-gray-300 text-gray-700 ml-1 mb-1">
            Plan cancelled.
          </p>
          <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
            The service will stop on{" "}
            {cancelAt && formatMillisecondsToDate(cancelAt)}
          </p>
        </div>
      </div>
      <Button
        onPress={() => {
          handleHotspotsToAdd(hotspotSubscription?.products_amount ?? 0);
          setSelected("step2");
        }}
        className="mt-6"
      >
        Select a plan
      </Button>
    </div>
  );
}
