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
            // if there is a change in the full_name, update the customer
            if (accountInfo.full_name) {
                await tx.customers.update({
                    where: {
                        customer_uuid: userId,
                    },
                    data: {
                        full_name: accountInfo.full_name,
                        email: accountInfo.email,
                    },
                });
            }

            // if there is a change in the company name, email, tax_id, vat_number, industry, update the company
            if (accountInfo.company_id) {
                await tx.companies.update({
                    where: {
                        id: accountInfo.company_id
                    },
                    data: {
                        name: accountInfo.company_name,
                        email: accountInfo.company_email,
                        tax_id: accountInfo.company_tax_id,
                        vat_number: accountInfo.vat_number,
                        industry: accountInfo.industry as industry_type
                    },
                });
            }
        });

        return await getAccountInfo();
    } catch (error) {
        console.error(error);
        return defaultAccountInfo;
    }
}