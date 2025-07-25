"use client";

import React, { useState } from "react";
import { Input, Button, Select, SelectItem } from "@heroui/react";

const billing = () => {

  return (
    <div className=" flex flex-row gap-8 w-full ">
      <div className="flex flex-col gap-3 w-1/2">
        <div className="flex flex-col items-center w-full">
          {/* Subscription section */}
          <div className="flex flex-col w-full">
            <p className="text-base font-semibold w-full align-left ">
              Subscription for your hotspots
            </p>
            <div className="flex flex-row gap-3 mt-2 items-center w-full">
              
            </div>
          </div>

          {/* Invoice section */}
          <div className="flex flex-col w-full mt-2">
            <p className="text-base font-semibold w-full align-left mt-6">
              Invoice history
            </p>
            <div className="flex flex-row w-1/2 mt-2">
              
            </div>
          </div>

          {/* Payment & billing section */}
          <div className="flex flex-col w-full mt-2">
            <p className="text-base font-semibold w-full align-left mt-6">
              Payment & billing methods
            </p>
            <div className="flex flex-row gap-3 mt-2 items-center w-full">
              
            </div>
            <div className="flex flex-row w-full mt-2">
              <Input
                isReadOnly
                className="w-1/2"
                defaultValue="1234567890"
                label="Tax ID/VAT number"
                type="text"
                variant="bordered"
              />
            </div>
          </div>

        </div>
      </div>

      <div className="flex flex-col gap-3 items-center w-1/2 justify-self-end">
        {/* Assign plan to hotspots section */}
        <div className="flex flex-col w-full max-w-[200px]">
          <p className="text-base font-semibold w-full align-left">Assign plan to hotspots</p>
          <div className="flex flex-row gap-3 mt-2 items-center w-full">
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default billing;
