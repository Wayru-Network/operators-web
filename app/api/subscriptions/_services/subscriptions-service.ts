"use server";

import { Prisma } from "@/lib/infra/prisma";
import {
    getStripeCustomerSubscription
} from "@/lib/services/stripe-service";
import { getSession } from "@/lib/session/session";
import { CustomerSubscription } from "@/lib/interfaces/subscriptions";
import { getCustomer } from "../../auth/callback/_services/customer-service";
import { getSubscriptionStatusDetails } from "../helpers/subscriptions.helpers";

// get or create a subscription for one user
export async function getCustomerSubscription(): Promise<CustomerSubscription | null> {
    try {
        const { userId } = await getSession();
        if (!userId) {
            return null;
        }

        // first get the customer
        const customer = await getCustomer(userId);
        if (!customer) {
            return null;
        }
        const customerId = customer?.id;

        let sub = await Prisma.subscriptions.findFirst({
            where: {
                customer_id: customerId,
            },
        });
        if (!sub) {
            // create a sub
            sub = await Prisma.subscriptions.create({
                data: {
                    customer_id: customerId,
                    hotspot_limit: 0,
                },
            });
        }

        // format response
        const response = {
            ...sub,
            is_subscription_active: false,
            is_trial_period_used: false,
            is_trialing: false,
            has_valid_subscription: false,
        };

        // if sub has a stripe subscription id return this too
        if (sub?.stripe_subscription_id) {
            const stripeSubscription = await getStripeCustomerSubscription(
                sub?.stripe_subscription_id
            );
            const statusDetails = getSubscriptionStatusDetails(stripeSubscription);
            return {
                ...response,
                stripe_subscription: stripeSubscription,
                is_subscription_active: statusDetails.is_subscription_active,
                is_trial_period_used: statusDetails.is_trial_period_used,
                is_trialing: statusDetails.is_trialing,
                has_valid_subscription: statusDetails.has_valid_subscription || false,
            };
        }

        return response;
    } catch (error) {
        console.log("getStripeCustomerSubscription error", error);
        return null;
    }
}
