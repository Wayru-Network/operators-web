import { industry_type } from "@/lib/generated/prisma";

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

export interface FormData {
    full_name: string;
    email: string;
    company_name: string;
    company_email: string;
    tax_id: string;
    industry: industry_type | null;
    company_id: number;
}