"use server";
import { Prisma } from "@/lib/infra/prisma";
import { getSession } from "@/lib/session/session";

export interface SubscriptionStatusResponse {
  able: boolean;
  maxPortals: number;
}

// Function to check if the user has a valid subscription
// This function can be used in the subscription service to determine if a user has an active subscription
export async function getSubscriptionStatus(): Promise<boolean> {
  const session = await getSession();
  if (!session?.userId) {
    return false;
  }
  const userId = session.userId;

  const customer = await Prisma.customers.findFirst({
    where: {
      customer_uuid: userId,
    },
  });

  if (!customer) {
    return false;
  }
  const sub = await Prisma.subscriptions.findFirst({
    where: {
      customer_id: customer.id,
    },
  });

  const currentDate = new Date();
  let subscriptionStatus = false;
  if (sub && sub.is_valid && sub.expiry_date > currentDate) {
    subscriptionStatus = true;
  }
  return subscriptionStatus;
}
