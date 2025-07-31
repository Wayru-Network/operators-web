"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { useBilling } from "../../../contexts/BillingContext";

const PlanNotSelected = () => {
  const { changeBillingStatus } = useBilling();

  return (
    <div className=" flex flex-row gap-8 w-full ">
      {/* Left side */}
      <div className="flex flex-col gap-3 w-1/2">
        <div className="flex flex-col items-center max-w-96">
          {/* Subscription section */}
          <div className="flex flex-col w-full">
            <p className="text-base font-semibold w-full align-left ">
              Subscription for your hotspots
            </p>
            <div className="flex flex-col gap-3 items-center justify-self-end">
              <div className="max-w-[300px] mt-7">
                <p className="text-xs  font-medium">
                  You do not have an active plan
                </p>
                <p className="text-xs  font-medium">
                  Select one to customize your hotspots.
                </p>
                <div>
                  <Button
                    className="w-full bg-[#000] dark:bg-[#fff] text-white dark:text-black mt-2"
                    onPress={() => changeBillingStatus("select-a-plan")}
                  >
                    Select plan
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice section */}
          <div className="flex flex-col w-full mt-2">
            <p className="text-base font-semibold w-full align-left mt-6">
              Invoice history
            </p>
            <div className="flex flex-row w-1/2 mt-2">
              <div className="flex flex-col w-full">
                <p className="text-xs  font-medium">None</p>
              </div>
            </div>
          </div>

          {/* Payment & billing section */}
          <div className="flex flex-col w-full mt-2">
            <p className="text-base font-semibold w-full align-left mt-6">
              Payment & billing methods
            </p>
            <div className="flex flex-row gap-3 mt-2 items-center w-full"></div>
            <div className="flex flex-row w-full mt-2">
              <div className="flex flex-col w-full">
                <p className="text-xs  font-medium">None</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-col gap-3 items-center w-1/2 justify-self-start">
        {/* Assign plan to hotspots section */}
        <div className="flex flex-col w-full max-w-[200px]">
          <p className="text-base font-semibold w-full align-left">
            Assign plan to hotspots
          </p>
          <div className="flex flex-row gap-3 mt-2 items-center w-full">
            <div className="flex flex-col w-full">
              <p className="text-xs  font-medium">Select a plan first</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanNotSelected;
