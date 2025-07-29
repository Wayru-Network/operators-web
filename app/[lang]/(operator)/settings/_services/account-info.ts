import { getSession } from "@/lib/session/session";
import { Prisma } from "@/lib/infra/prisma";

export interface AccountInfo {
    id: number;
    created_at: Date | null;
    updated_at: Date | null;
    customer_uuid: string;
    full_name: string;
    email: string | null;
    company: {
        company_name: string;
        company_email: string;
        company_tax_id: string;
        vat_number: string;
        industry: string;
        company_id: number;
    }
}
export const defaultAccountInfo: AccountInfo = {
    id: 0,
    created_at: null,
    updated_at: null,
    customer_uuid: "",
    full_name: "",
    email: "",
    company: {
        company_name: "",
        company_email: "",
        company_tax_id: "",
        vat_number: "",
        industry: "",
        company_id: 0,
    },
};
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

