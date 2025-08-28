import { Prisma } from "@/lib/infra/prisma";
import { Prisma as PrismaGenerated } from "@/lib/generated/prisma";
import { getStripeCustomer } from "@/lib/services/stripe-service";

export async function getOrCreateCustomer(
    uuid: string,
    customerData: Partial<PrismaGenerated.customersUncheckedCreateInput>
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
            },
        });
    }

    // get stripe customer
    const stripeCustomer = await getStripeCustomer(customer.customer_uuid);
    if (customer?.stripe_customer_id !== stripeCustomer?.id) {
        customer = await Prisma.customers.update({
            where: { id: customer.id },
            data: { stripe_customer_id: stripeCustomer?.id || "" },
        });
    }
    return customer;
}

export const getCustomer = async (uuid: string) => {
    const customer = await Prisma.customers.findFirst({
        where: {
            customer_uuid: uuid,
        },
    });
    return customer;
};
