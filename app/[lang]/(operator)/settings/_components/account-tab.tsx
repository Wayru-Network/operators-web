"use client";

import React, { useState, useEffect, useTransition } from "react";
import { Button, Select, SelectItem, Form, Spacer } from "@heroui/react";
import { updateAccountInfoAction } from "../_services/account-info";
import { industry_type } from "@/lib/generated/prisma";
import { AccountInfo, AccountInfoUpdate, FormData } from "../_services/types";
import { CustomInput } from "@/lib/components/custom-input";
const SPACER_SECTION = 9;
// delete account section
const DISABLED_DELETE_ACCOUNT = true;

const AccountTab = ({ accountInfo }: { accountInfo: AccountInfo }) => {
  const [mounted, setMounted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  // Local state to handle changes
  const [formData, setFormData] = useState<FormData>({
    full_name: "",
    email: "",
    company_name: "",
    company_email: "",
    tax_id: "",
    industry: null,
    company_id: 0,
  });

  // Original state to compare changes
  const [originalData, setOriginalData] = useState<FormData>({
    full_name: "",
    email: "",
    company_name: "",
    company_email: "",
    tax_id: "",
    industry: null,
    company_id: 0,
  });

  useEffect(() => {
    setMounted(true);

    // Initialize form data after mount to avoid hydration mismatch
    setFormData({
      full_name: accountInfo.full_name,
      email: accountInfo.email || "",
      company_name: accountInfo.company.company_name,
      company_email: accountInfo.company.company_email,
      tax_id:
        accountInfo.company.company_tax_id ||
        accountInfo.company.vat_number ||
        "",
      industry: accountInfo.company.industry as industry_type,
      company_id: accountInfo.company.company_id,
    });

    setOriginalData({
      full_name: accountInfo.full_name,
      email: accountInfo.email || "",
      company_name: accountInfo.company.company_name,
      company_email: accountInfo.company.company_email,
      tax_id:
        accountInfo.company.company_tax_id ||
        accountInfo.company.vat_number ||
        "",
      industry: accountInfo.company.industry as industry_type | null,
      company_id: accountInfo.company.company_id,
    });
  }, [accountInfo]);

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
  const hasChanges = () => {
    return (
      formData.full_name !== originalData.full_name ||
      formData.email !== originalData.email ||
      formData.company_name !== originalData.company_name ||
      formData.company_email !== originalData.company_email ||
      formData.tax_id !== originalData.tax_id ||
      formData.industry !== originalData.industry
    );
  };

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
  const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // do not reload the page
    if (validateForm()) {
      // Create an object with only the changed fields
      const changedData: Partial<AccountInfoUpdate> = {};

      // Check customer fields (full_name, email)
      if (formData.full_name !== originalData.full_name) {
        changedData.full_name = formData.full_name;
        changedData.email = formData.email;
      }

      // Check company fields
      if (formData.company_name !== originalData.company_name) {
        changedData.company_name = formData.company_name;
      }

      if (formData.company_email !== originalData.company_email) {
        changedData.company_email = formData.company_email;
      }

      if (formData.tax_id !== originalData.tax_id) {
        changedData.company_tax_id = formData.tax_id;
      }

      if (formData.industry !== originalData.industry) {
        changedData.industry = formData.industry as industry_type;
      }

      // Always include company_id if any company field has changed
      if (
        Object.keys(changedData).some((key) =>
          [
            "company_name",
            "company_email",
            "company_tax_id",
            "industry",
          ].includes(key)
        )
      ) {
        changedData.company_id = formData.company_id;
      }

      // Only proceed if there are actual changes
      if (Object.keys(changedData).length > 0) {
        startTransition(async () => {
          try {
            const newAccountInfo = await updateAccountInfoAction(changedData);

            // Update local state with new data
            setFormData({
              full_name: newAccountInfo.full_name,
              email: newAccountInfo.email || "",
              company_name: newAccountInfo.company.company_name,
              company_email: newAccountInfo.company.company_email,
              tax_id: newAccountInfo.company.company_tax_id || "",
              industry: newAccountInfo.company.industry as industry_type,
              company_id: newAccountInfo.company.company_id,
            });

            setOriginalData({
              full_name: newAccountInfo.full_name,
              email: newAccountInfo.email || "",
              company_name: newAccountInfo.company.company_name,
              company_email: newAccountInfo.company.company_email,
              tax_id: newAccountInfo.company.company_tax_id || "",
              industry: newAccountInfo.company.industry as industry_type,
              company_id: newAccountInfo.company.company_id,
            });
          } catch (error) {
            console.error("Error updating account info:", error);
          }
        });
      }
    }
  };

  if (!mounted) {
    return <div className="flex flex-row gap-8 w-full">Loading...</div>;
  }

  return (
    <div className="flex md:flex-col lg:flex-row w-full gap-8">
      <Form
        className="flex flex-col md:w-full w-2/3"
        onSubmit={handleSaveChanges}
        validationErrors={errors}
      >
        <div className="w-full">
          {/* Personal Information section */}
          <RenderSection
            title="Personal Information"
            Input1={
              <CustomInput
                value={formData.full_name}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                label="Full Name"
                type="text"
                wrapperClass="w-full max-h-[30px]"
                placeholder="John Doe"
                required
                inputClass="!text-sm"
                labelClass="!text-sm"
              />
            }
            Input2={
              <CustomInput
                className="w-full focus:outline-none focus:ring-0 focus-visible:outline-none"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                label="Email Address"
                type="email"
                wrapperClass="w-full max-h-[30px]"
                required
                inputClass="!text-sm"
                labelClass="!text-sm"
              />
            }
          />
          <Spacer y={SPACER_SECTION} />

          {/* Company Information section */}
          <RenderSection
            title="Company Information (Optional)"
            Input1={
              <CustomInput
                value={formData.company_name}
                onChange={(e) =>
                  handleInputChange("company_name", e.target.value)
                }
                label="Company Name"
                placeholder="Pop Bar"
                type="text"
                wrapperClass="w-full max-h-[30px]"
                inputClass="!text-sm"
                labelClass="!text-sm"
              />
            }
            Input2={
              <CustomInput
                value={formData.company_email}
                onChange={(e) =>
                  handleInputChange("company_email", e.target.value)
                }
                label="Business Email"
                placeholder="business@email.com"
                type="email"
                wrapperClass="w-full max-h-[30px]"
                inputClass="!text-sm"
                labelClass="!text-sm"
              />
            }
          />
          <Spacer y={SPACER_SECTION} />

          {/* Industry section */}
          <RenderSection
            title="Industry"
            Input1={
              <Select
                variant="bordered"
                className="mt-[-10px]"
                size="sm"
                placeholder={
                  formData.industry ? formData.industry : "Select Industry"
                }
                value={formData.industry || ""}
                onSelectionChange={(e) =>
                  handleInputChange("industry", e?.currentKey as string)
                }
                classNames={{
                  trigger:
                    "!text-black dark:!text-white data-[has-value=true]:!text-black dark:data-[has-value=true]:!text-white !border-neutral-300 !h-[48px]",
                  value: "!text-black dark:!text-white",
                  listbox: "!text-black dark:!text-white",
                }}
              >
                {industries.map((industry) => (
                  <SelectItem key={industry.value}>{industry.label}</SelectItem>
                ))}
              </Select>
            }
          />

          {/* Action buttons */}
          {hasChanges() && (
            <Button
              isLoading={isPending}
              className="w-full mt-4 dark:bg-[#751CF6] bg-[#000] text-white"
              type="submit"
            >
              {isPending ? "Saving..." : "Save All Changes"}
            </Button>
          )}
        </div>
      </Form>
      {!DISABLED_DELETE_ACCOUNT && (
        <div className="flex flex-col items-start md:w-full lg:w-1/3 justify-self-end">
          {/* Other section */}
          <div className="flex flex-col w-full">
            <p className="text-base font-semibold w-full align-left">Other</p>
            <div className="flex flex-col gap-3 md:mt-3 lg:mt-8 items-center w-full">
              <Button className="w-full bg-[#751CF6] border-2 border-gray-200 dark:border-gray-700 text-white">
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface RenderSectionProps {
  title: string;
  Input1: React.ReactNode;
  Input2?: React.ReactNode;
}

const RenderSection = ({ title, Input1, Input2 }: RenderSectionProps) => {
  return (
    <div className="w-full">
      <p className="text-lg font-semibold w-full align-left">{title}</p>
      {/* Personal Information container */}
      <div className="mt-8 w-full">
        {/* Personal Information content */}
        <div className="flex flex-row gap-5 rounded-[10px] relative h-[80px] w-full">
          <div className="w-1/2 relative">{Input1}</div>
          <div className="w-1/2">{Input2}</div>
        </div>
      </div>
    </div>
  );
};

export default AccountTab;
