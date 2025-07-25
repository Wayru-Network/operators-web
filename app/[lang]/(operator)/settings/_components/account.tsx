"use client";

import React, { useState } from "react";
import { Input, Button, Select, SelectItem } from "@heroui/react";

const account = () => {
  const [language, setLanguage] = useState("en");

  const languages = [
    { label: "English (US)", value: "en" },
    { label: "Spanish", value: "es" },
    { label: "Portuguese (BR)", value: "pt" },
  ];

  const industries = [
    { label: "Telecom", value: "telecom" },
    { label: "Finance", value: "finance" },
    { label: "Healthcare", value: "healthcare" },
    { label: "Education", value: "education" },
    { label: "Technology", value: "technology" },
  ];

  return (
    <div className=" flex flex-row gap-8 w-full ">
      <div className="flex flex-col gap-3 w-1/2">
        <div className="flex flex-col items-center w-full">
          {/* Personal Information section */}
          <div className="flex flex-col w-full">
            <p className="text-base font-semibold w-full align-left ">
              Personal Information
            </p>
            <div className="flex flex-row gap-3 mt-2 items-center w-full">
              <Input
                isReadOnly
                className="w-1/2"
                defaultValue="Pepe el pollo"
                label="Full Name"
                type="text"
                variant="bordered"
              />
              <Input
                isReadOnly
                className="w-1/2"
                defaultValue="pepe@pepe.com"
                label="Email Address"
                type="email"
                variant="bordered"
              />
            </div>
          </div>

          {/* Language section */}
          <div className="flex flex-col w-full mt-2">
            <p className="text-base font-semibold w-full align-left mt-6">
              Language
            </p>
            <div className="flex flex-row w-1/2 mt-2">
              <Select
                variant="bordered"
                size="sm"
                placeholder={`English (US)`}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {languages.map((language) => (
                  <SelectItem key={language.value}>{language.label}</SelectItem>
                ))}
              </Select>
            </div>
          </div>

          {/* Company Information section */}
          <div className="flex flex-col w-full mt-2">
            <p className="text-base font-semibold w-full align-left mt-6">
              Company Information (Optional)
            </p>
            <div className="flex flex-row gap-3 mt-2 items-center w-full">
              <Input
                isReadOnly
                className="w-1/2"
                defaultValue="Dunder Mifflin"
                label="Company Name"
                type="text"
                variant="bordered"
              />
              <Input
                isReadOnly
                className="w-1/2"
                defaultValue="dundermifflin@dundermifflin.com"
                label="Business Email"
                type="email"
                variant="bordered"
              />
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

          {/* Industry section */}
          <div className="flex flex-col w-full mt-2">
            <p className="text-base font-semibold w-full align-left mt-6">
              Industry
            </p>
            <div className="flex flex-row w-1/2 mt-2">
              <Select
                variant="bordered"
                size="sm"
                placeholder={`Telecom`}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {industries.map((industry) => (
                  <SelectItem key={industry.value}>{industry.label}</SelectItem>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 items-center w-1/2 justify-self-end">
        {/* Other section */}
        <div className="flex flex-col w-full max-w-[200px]">
          <p className="text-base font-semibold w-full align-left">Other</p>
          <div className="flex flex-col gap-3 mt-2 items-center w-full">
            <Button className="w-full bg-[#751CF6] text-white">Logout</Button>
            <Button className="w-full bg-transparent border-2 border-gray-200 dark:border-gray-700 text-color">
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default account;
