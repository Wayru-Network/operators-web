import { useDisclosure } from "@heroui/react";
import { ArrowDownToLine } from "lucide-react";
import moment from "moment";
import { Steps } from "../../billing-tab";
import AssignPlanHotspots from "./assign-plan-hotspots";
import PaymentAndBillingMethod from "../payment-method/payment-and-billing-method";
import PlanActiveDetails from "./activation-details/plan-active-details";
import PlanCancelledDetails from "./activation-details/plan-cancelled-details";

interface PlanActiveProps {
  setSelected: (key: Steps) => void;
}

const PlanDetails = ({ setSelected }: PlanActiveProps) => {
  // STRIPE REMOVAL
  const currentMonth = moment().format("MMMM");
  const currentYear = moment().format("YYYY");
  const { onOpen } = useDisclosure();
  // TODO: enable this when we have a invoicing method
  const latestInvoice = false;
  const hideButton = false;

  return (
    <div className="flex md:flex-col lg:flex-row gap-8 w-full">
      {/* <CancelPlanModal
        subId={hotspotSubscription?.subscription_id ?? ""}
        isOpen={isOpen}
        onClose={onClose}
      /> */}
      {/* Left side */}
      <div className="flex flex-col gap-3 lg:w-1/2 md:w-full">
        <div className="flex flex-col items-center w-full lg:max-w-96 ">
          {/* Subscription for your hotspots section */}
          {false ? (
            <PlanCancelledDetails setSelected={setSelected} />
          ) : (
            <PlanActiveDetails
              setSelected={setSelected}
              openCancelModal={onOpen}
            />
          )}
          {/* Invoice history section */}
          <div className="flex flex-col w-full mt-2">
            <p className="text-base font-semibold w-full align-left mt-6">
              Invoice history
            </p>
            {latestInvoice ? (
              <div className="flex flex-row w-full items-center gap-4 ml-4 mt-2 justify-between">
                <div>
                  <p className="text-xs  font-small">
                    {0} hotspots - Monthly Plan
                  </p>
                  <p className="text-lg  font-medium">
                    {currentMonth} {currentYear}
                  </p>
                </div>
                <ArrowDownToLine
                  onClick={() => window.open(latestInvoice, "_blank")}
                  size={22}
                  className="cursor-pointer mr-4"
                />
              </div>
            ) : (
              <div className="flex flex-row w-full items-center gap-4 ml-4 mt-2 justify-between">
                <p className="text-md  font-medium">None</p>
              </div>
            )}
          </div>

          {/* Payment & billing methods section */}
          <PaymentAndBillingMethod
            setSelected={setSelected}
            hideButton={!!hideButton}
          />
        </div>
      </div>

      {/* Right side */}
      <AssignPlanHotspots />
    </div>
  );
};

export default PlanDetails;
