"use client";

import React from "react";
import { Button } from "@heroui/react";
import { Steps } from "../../billing-tab";
import PaymentAndBillingMethod from "../payment-method/payment-and-billing-method";

interface PlanNotSelectedProps {
  setSelected: (key: Steps) => void;
}

const PlanNotSelected = ({ setSelected }: PlanNotSelectedProps) => {
  // implement the invoicing when create a service for making invoice
  const isDisabledInvoicing = true;

  return (
    <div className=" flex md:flex-col lg:flex-row gap-8 w-full ">
      {/* Left side */}
      <div className="flex flex-col gap-3 md:w-full lg:w-1/2">
        <div className="flex flex-col items-center max-w-96">
          {/* Subscription section */}
          <div className="flex flex-col w-full">
            <p className="text-lg font-semibold w-full align-left ">
              Subscription for your hotspots
            </p>
            <div className="flex flex-col ml-4 items-start w-full">
              <div className="max-w-[300px] mt-5">
                <p className="text-xs  font-medium">
                  You do not have an active plan
                </p>
                <p className="text-xs  font-medium">
                  Select one to customize your hotspots.
                </p>
                <div>
                  <Button
                    className="w-full bg-[#000] dark:bg-[#fff] text-white dark:text-black mt-2"
                    onPress={() => setSelected("step2")}
                  >
                    Select plan
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice section */}
          {!isDisabledInvoicing && (
            <div className="flex flex-col w-full mt-2">
              <p className="text-lg font-semibold w-full align-left mt-6">
                Invoice history
              </p>
              <div className="flex flex-row w-1/2 mt-2">
                <div className="flex flex-col w-full">
                  <p className="text-xs  font-medium">None</p>
                </div>
              </div>
            </div>
          )}

          {/* Payment & billing section */}
          <div className="flex flex-col w-full">
            <PaymentAndBillingMethod setSelected={setSelected} notShowBtn />
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-col gap-3 items-center md:w-full lg:w-1/2 justify-self-start">
        {/* Assign plan to hotspots section */}
        <div className="flex flex-col w-full md:w-full lg:max-w-[200px]">
          <p className="text-base font-semibold w-full align-left">
            Assign plan to hotspots
          </p>
          <div className="flex flex-row gap-3 mt-2 md:items-left lg:items-center w-full">
            <div className="flex flex-col w-full">
              <p className="text-xs font-medium">Select a plan first</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanNotSelected;
