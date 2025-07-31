import { Prisma } from "@/lib/infra/prisma";

interface Customer {
    email: string;
    name: string;
    full_name: string;
    phone: string;
}
export async function getOrCreateCustomer(
    uuid: string,
    customerData: Partial<Customer>
) {
    let customer = await Prisma.customers.findFirst({
        where: {
            customer_uuid: uuid,
        },
    });

    if (!customer) {
        customer = await Prisma.customers.create({
            data: {
                customer_uuid: uuid,
                full_name: customerData.full_name || "",
                email: customerData.email || "",
            },
        });
    }

    // create a company if it doesn't exist
    let company = await Prisma.companies.findFirst({
        where: {
            customer_id: customer.id,
        },
    });

    if (!company) {
        company = await Prisma.companies.create({
            data: {
                customer_id: customer.id,
                name: "",
                email: "",
                tax_id: "",
                vat_number: "",
            }
        });
    }

    return customer;
}
