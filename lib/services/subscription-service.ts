"use server";
import { Prisma } from "@/lib/infra/prisma";

export async function getSubscriptionStatus(userId: string): Promise<boolean> {
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
