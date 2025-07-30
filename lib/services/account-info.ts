"use server";
import { AccountInfo, defaultAccountInfo, getAccountInfo } from "@/app/[lang]/(operator)/settings/_services/account-info";
import { getSession } from "../session/session";
import { Prisma } from "../infra/prisma";
import { industry_type } from "../generated/prisma";


export interface AccountInfoUpdate {
    full_name: string;
    email: string;
    company_name: string;
    company_email: string;
    company_tax_id: string;
    vat_number: string;
    industry: industry_type;
    company_id: number;
}
export async function updateAccountInfo(accountInfo: Partial<AccountInfoUpdate>): Promise<AccountInfo> {
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

        return await getAccountInfo();
    } catch (error) {
        console.error(error);
        return defaultAccountInfo;
    }
}