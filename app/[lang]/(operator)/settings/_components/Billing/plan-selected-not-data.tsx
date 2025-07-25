import { Button } from "@heroui/react";
import { Minus, Plus } from "lucide-react";

export default function PlanSelectedNotData() {
  return (
    <div className=" flex flex-row gap-8 w-full ">

      {/* Left side */}
      <div className="flex flex-col gap-3 w-1/2">
        <div className="flex flex-col items-center max-w-96">
          {/* Current plan section */}
          <div className="flex flex-col w-full">
            <p className="text-base font-semibold w-full align-left ">
              Current plan
            </p>
            <div className="flex flex-col w-full mt-2 ml-4">
              <div className="flex flex-row">
                <p className="text-xs font-semibold">Active hotspots:</p>
                <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">0</p>
              </div>
              <div className="flex flex-row">
                <p className="text-xs font-semibold">Monthly cost:</p>
                <p className="text-xs font-medium dark:text-gray-300 text-gray-700 ml-1">$0</p>
              </div>
            </div>
          </div>

          {/* Add or remove hotspots section */}
          <div className="flex flex-col w-full mt-2">
            <p className="text-base font-semibold w-full align-left mt-6">
              Add or remove hotspots
            </p>
            <div className="flex flex-row w-full items-center gap-4 ml-4 mt-2">
              <Minus size={16} className="cursor-pointer" />
              <p className="text-xs  font-medium">10</p>
              <Plus size={16} className="cursor-pointer" />
            </div>
          </div>

          {/* New plan review section */}
          <div className="flex flex-col w-full mt-2">
            <p className="text-base font-semibold w-full align-left mt-6">
              New plan review
            </p>
            <div className="flex flex-row gap-3 mt-2 items-center w-full"></div>
            <div className="flex flex-row w-full">
              <div className="flex flex-col w-full ml-4">
                <div className="flex flex-row">
                  <p className="text-xs  font-semibold">New monthly cost:</p>
                  <p className="text-xs  font-medium ml-1 dark:text-gray-300 text-gray-700">$749.75</p>
                </div>
                <div className="flex flex-row">
                  <p className="text-xs  font-semibold">Change in cost:</p>
                  <p className="text-xs  font-medium ml-1 dark:text-gray-300 text-gray-700">$749.75</p>
                </div>
              </div>
            </div>
          </div>

          <Button className="w-full bg-[#000] dark:bg-[#fff] text-white dark:text-black mt-9">
            Proceed to checkout
          </Button>
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-col gap-3 items-center w-1/2 justify-self-end">
        
      </div>
    </div>
  );
}
