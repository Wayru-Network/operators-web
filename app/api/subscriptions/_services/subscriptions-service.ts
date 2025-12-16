"use server";

import { Prisma } from "@/lib/infra/prisma";
import { getSession } from "@/lib/session/session";
import { CustomerSubscription } from "@/lib/interfaces/subscriptions";
import { getCustomer } from "../../auth/callback/_services/customer-service";

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

    const sub = await Prisma.subscriptions.findFirst({
      where: {
        customer_id: customerId,
      },
    });
    if (!sub) {
      // create a sub
      return null;
    }

    // format response
    const response = {
      ...sub,
      is_subscription_active: false,
      is_trial_period_used: false,
      is_trialing: false,
      has_valid_subscription: false,
    };

    return response;
  } catch (error) {
    console.log("getStripeCustomerSubscription error", error);
    return null;
  }
}
