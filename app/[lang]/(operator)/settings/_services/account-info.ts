"use server";

import { getSession } from "@/lib/session/session";
import { Prisma } from "@/lib/infra/prisma";
import { revalidatePath } from "next/cache";
import { AccountInfo, defaultAccountInfo } from "./types";
import { AccountInfoUpdate } from "./types";
import { industry_type } from "@/lib/generated/prisma";


export async function getAccountInfo(): Promise<AccountInfo> {
    try {
        const { userId } = await getSession();

        if (!userId) {
            return defaultAccountInfo;
        }

        const customer = await Prisma.customers.findFirst({
            where: {
                customer_uuid: userId,
            },
        });

        if (!customer) {
            return defaultAccountInfo;
        }

        // get company info
        const company = await Prisma.companies.findFirst({
            where: {
                customer_id: customer.id,
            },
        });

        if (!company) {
            return {
                ...customer,
                company: {
                    ...defaultAccountInfo.company,
                },
            };
        }

        return {
            ...customer,
            company: {
                company_name: company.name,
                company_email: company.email,
                company_tax_id: company.tax_id || "",
                vat_number: company.vat_number || "",
                industry: company.industry,
                company_id: company.id,
            },
        };
    } catch (error) {
        console.error(error);
        return defaultAccountInfo;
    }
}

export async function updateAccountInfoAction(accountInfo: Partial<AccountInfoUpdate>): Promise<AccountInfo> {
    try {
        const { userId } = await getSession();

        await Prisma.$transaction(async (tx) => {
            // Update customer if full_name is provided
            if (accountInfo.full_name !== undefined) {
                const customerData: any = {};
                if (accountInfo.full_name !== undefined) customerData.full_name = accountInfo.full_name;
                if (accountInfo.email !== undefined) customerData.email = accountInfo.email;

                await tx.customers.update({
                    where: {
                        customer_uuid: userId,
                    },
                    data: customerData,
                });
            }

            // Update company if company_id is provided and any company field is present
            if (accountInfo.company_id && (
                accountInfo.company_name !== undefined ||
                accountInfo.company_email !== undefined ||
                accountInfo.company_tax_id !== undefined ||
                accountInfo.vat_number !== undefined ||
                accountInfo.industry !== undefined
            )) {
                const companyData: any = {};
                if (accountInfo.company_name !== undefined) companyData.name = accountInfo.company_name;
                if (accountInfo.company_email !== undefined) companyData.email = accountInfo.company_email;
                if (accountInfo.company_tax_id !== undefined) companyData.tax_id = accountInfo.company_tax_id;
                if (accountInfo.vat_number !== undefined) companyData.vat_number = accountInfo.vat_number;
                if (accountInfo.industry !== undefined) companyData.industry = accountInfo.industry as industry_type;

                await tx.companies.update({
                    where: {
                        id: accountInfo.company_id
                    },
                    data: companyData,
                });
            }
        });

        // Revalidate the settings page to show updated data
        revalidatePath('/settings');

        return await getAccountInfo();
    } catch (error) {
        console.error(error);
        return defaultAccountInfo;
    }
}