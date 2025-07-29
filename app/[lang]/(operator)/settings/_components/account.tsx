"use client";

import React, { useState, useEffect } from "react";
import { Input, Button, Select, SelectItem } from "@heroui/react";
import { AccountInfo } from "../_services/account-info";
import {
  AccountInfoUpdate,
  updateAccountInfo,
} from "@/lib/services/account-info";
import { industry_type } from "@/lib/generated/prisma";

const account = ({ accountInfo }: { accountInfo: AccountInfo }) => {
  const [language, setLanguage] = useState("en");
  const [mounted, setMounted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, setIsPending] = useState(false);

  // Local state to handle changes
  const [formData, setFormData] = useState({
    full_name: accountInfo.full_name,
    email: accountInfo.email || "",
    company_name: accountInfo.company.company_name,
    company_email: accountInfo.company.company_email,
    tax_id:
      accountInfo.company.company_tax_id ||
      accountInfo.company.vat_number ||
      "",
    industry: accountInfo.company.industry || ("telecom" as industry_type),
    company_id: accountInfo.company.company_id,
  });

  // Original state to compare changes
  const [originalData] = useState({
    full_name: accountInfo.full_name,
    email: accountInfo.email || "",
    company_name: accountInfo.company.company_name,
    company_email: accountInfo.company.company_email,
    tax_id:
      accountInfo.company.company_tax_id ||
      accountInfo.company.vat_number ||
      "",
    industry: accountInfo.company.industry || "telecom",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Fc to update state
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Check if there are changes
  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  // Validations
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateRequired = (value: string) => {
    return value.trim().length > 0;
  };

  // Fc to validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!validateRequired(formData.full_name)) {
      newErrors.full_name = "Full name is required";
    }

    if (!validateRequired(formData.email)) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (formData.company_email && !validateEmail(formData.company_email)) {
      newErrors.company_email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fc to save changes
  const handleSaveChanges = async () => {
    if (validateForm()) {
      setIsPending(true);
      const newAccountInfo = await updateAccountInfo(
        formData as unknown as AccountInfoUpdate
      );
      setFormData({
        full_name: newAccountInfo.full_name,
        email: newAccountInfo.email || "",
        company_name: newAccountInfo.company.company_name,
        company_email: newAccountInfo.company.company_email,
        tax_id: newAccountInfo.company.company_tax_id || "",
        industry: newAccountInfo.company.industry || "telecom",
        company_id: newAccountInfo.company.company_id,
      });
      setIsPending(false);
    }
  };

  if (!mounted) {
    return <div className="flex flex-row gap-8 w-full">Loading...</div>;
  }

  return (
    <div className="flex flex-row gap-8 w-full">
      <div className="flex flex-col gap-3 w-1/2">
        <div className="flex flex-col items-center w-full">
          {/* Personal Information section */}
          <div className="flex flex-col w-full">
            <p className="text-base font-semibold w-full align-left">
              Personal Information
            </p>
            <div className="flex flex-row gap-3 mt-2 items-center w-full">
              <div className="w-1/2">
                <Input
                  className="w-full focus:outline-none focus:ring-0 focus-visible:outline-none"
                  value={formData.full_name}
                  onChange={(e) =>
                    handleInputChange("full_name", e.target.value)
                  }
                  label="Full Name"
                  type="text"
                  variant="bordered"
                  maxLength={20}
                />
              </div>
              <div className="w-1/2">
                <Input
                  className="w-full focus:outline-none focus:ring-0 focus-visible:outline-none"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  label="Email Address"
                  type="email"
                  variant="bordered"
                  isRequired
                  disabled={true}
                />
              </div>
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
              <div className="w-1/2">
                <Input
                  className="w-full focus:outline-none focus:ring-0 focus-visible:outline-none"
                  value={formData.company_name}
                  onChange={(e) =>
                    handleInputChange("company_name", e.target.value)
                  }
                  label="Company Name"
                  type="text"
                  variant="bordered"
                />
              </div>
              <div className="w-1/2">
                <Input
                  className="w-full focus:outline-none focus:ring-0 focus-visible:outline-none"
                  value={formData.company_email}
                  onChange={(e) =>
                    handleInputChange("company_email", e.target.value)
                  }
                  label="Business Email"
                  type="email"
                  variant="bordered"
                  isInvalid={!!errors.company_email}
                  errorMessage={errors.company_email}
                />
              </div>
            </div>
            <div className="flex flex-row w-full mt-2">
              <div className="w-1/2">
                <Input
                  className="w-full focus:outline-none focus:ring-0 focus-visible:outline-none"
                  value={formData.tax_id}
                  onChange={(e) => handleInputChange("tax_id", e.target.value)}
                  label="Tax ID/VAT number"
                  variant="bordered"
                />
              </div>
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
                placeholder={`Select Industry`}
                value={formData.industry}
                onSelectionChange={(e) =>
                  handleInputChange("industry", e?.currentKey as string)
                }
                classNames={{
                  trigger:
                    "!text-black dark:!text-white data-[has-value=true]:!text-black dark:data-[has-value=true]:!text-white",
                  value: "!text-black dark:!text-white",
                  listbox: "!text-black dark:!text-white",
                }}
              >
                {industries.map((industry) => (
                  <SelectItem key={industry.value}>{industry.label}</SelectItem>
                ))}
              </Select>
            </div>
          </div>

          {/* Action buttons */}
          {hasChanges && (
            <Button
              onPress={handleSaveChanges}
              disabled={!hasChanges}
              className="w-full mt-4 dark:bg-[#751CF6] bg-[#000] text-white"
            >
              {isPending ? "Saving..." : "Save All Changes"}
            </Button>
          )}
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
