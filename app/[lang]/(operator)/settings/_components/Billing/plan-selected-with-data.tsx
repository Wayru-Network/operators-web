import { Button, Select, SelectItem } from "@heroui/react";
import { ArrowDownToLine } from "lucide-react";
import { PaymentIcon } from "react-svg-credit-card-payment-icons";
import PlanTable from "./plan-table";

export default function PlanSelectedWithData() {
  const plans = [
    {
      label: "Monthly",
      value: "monthly",
    },
    {
      label: "Yearly",
      value: "yearly",
    },
  ];

  return (
    <div className=" flex flex-row gap-8 w-full ">

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
                <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">10</p>
              </div>
              <div className="flex flex-row">
                <p className="text-xs font-semibold">Billing cycle:</p>
                <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
                  Monthly
                </p>
              </div>
              <div className="flex flex-row">
                <p className="text-xs font-semibold">Price per hotspot:</p>
                <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">$29.50</p>
              </div>
              <div className="flex flex-row">
                <p className="text-xs font-semibold">Total monthly cost:</p>
                <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
                  $749.75
                </p>
              </div>
              <div className="flex flex-row">
                <p className="text-xs font-semibold">Next billing date:</p>
                <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">
                  March 15, 2025
                </p>
              </div>
            </div>
            <div className="flex flex-row w-full justify-start mt-3">
              <Button className="w-1/2 bg-[#000] dark:bg-[#fff] text-white dark:text-black">
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
            <div className="flex flex-row w-full items-center gap-4 ml-4 mt-2 justify-between">
              <div>
                <p className="text-xs  font-small">
                  25 hotspots - Monthly Plan
                </p>
                <p className="text-lg  font-medium">February 2025</p>
              </div>
              <ArrowDownToLine size={22} className="cursor-pointer mr-4" />
            </div>
          </div>

          {/* Payment & billing methods section */}
          <div className="flex flex-col w-full mt-2">
            <p className="text-base font-semibold w-full align-left mt-6">
              Payment & billing methods
            </p>
            <div className="flex flex-row gap-3 mt-2 items-center w-full"></div>
            <div className="flex flex-row w-full">
              <div className="flex flex-row w-full ml-4 items-center">
                <PaymentIcon type="Mastercard" format="logo" className="mr-2" />
                <div>
                  <p className="text-sm  font-medium">Mastercard **** 1234</p>
                  <p className="text-xs  font-normal">Expires October 2025</p>
                </div>
              </div>
            </div>
          </div>

          <Button className="w-full bg-[#000] dark:bg-[#fff] text-white dark:text-black mt-9">
            Change
          </Button>
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-col gap-3 items-center w-1/2 justify-self-end">
        {/* Assign plan to hotspots section */}
        <div className="flex flex-col max-w-96 ">
          <p className="text-base font-semibold w-full align-left ">
            Assign plan to hotspots
          </p>
          <div className="flex flex-col w-full mt-2 ml-4 gap-1">
            <div className="flex flex-row">
              <p className="text-xs font-semibold">Number of hotspots:</p>
              <p className="text-xs font-medium text-gray-700 ml-1">10</p>
            </div>
          </div>
          <div className="flex flex-row w-full justify-start mt-3">
            <Select
              variant="bordered"
              size="sm"
              placeholder={`None`}
              value={plans[0].value}
            >
              {plans.map((plan) => (
                <SelectItem key={plan.value}>{plan.label}</SelectItem>
              ))}
            </Select>
          </div>
          <div className="mt-2">
            <PlanTable />
          </div>
        </div>
      </div>

    </div>
  );
}
