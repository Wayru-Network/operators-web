"use server";

import { getCustomer } from "@/app/api/auth/callback/_services/customer-service";
import { Prisma } from "@/lib/infra/prisma";
import { getSession } from "@/lib/session/session";

export async function getHotspotBySubscription() {
  try {
    const { userId } = await getSession();
    if (!userId) {
      return [];
    }
    const customer = await getCustomer(userId);
    if (!customer) {
      return null;
    }

    // @TODO: Update this valid sub logic due to STRIPE REMOVAL
    const sub = await Prisma.subscriptions.findFirst({
      where: {
        customer_id: customer?.id,
        is_valid: true,
      },
    });
    if (!sub) {
      return [];
    }
    const hotspots = await Prisma.hotspot.findMany({
      where: {
        subscription_id: sub?.id,
      },
    });
    return hotspots;
  } catch (error) {
    console.error("err getHotspotBySubscription", error);
    return [];
  }
}
