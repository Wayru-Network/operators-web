"use server";

//import { getCustomerSubscription } from "@/app/api/subscriptions/_services/subscriptions-service";
import { Prisma } from "@/lib/infra/prisma";
import { getSession } from "@/lib/session/session";
import { getHotspots } from "../../../hotspots/_services/get-hotspots";

export async function canCreatePortal(): Promise<boolean> {
  const session = await getSession();
  if (!session?.userId) {
    return false;
  }

  const hotspots = await getHotspots(1, 150);
  if (hotspots.meta.total === 0) {
    return false;
  }

  const portals = await Prisma.portal_config.count({
    where: {
      user_id: session.userId,
    },
  });

  console.log("portals", portals);
  console.log("hotspots", hotspots.meta.total);

  if (portals >= hotspots.meta.total) {
    return false;
  }

  // const subscription = await getCustomerSubscription();
  // if (!subscription?.has_valid_subscription) {
  //   const portals = await Prisma.portal_config.count({
  //     where: {
  //       user_id: session.userId,
  //     },
  //   });
  //   if (portals >= 1) {
  //     return false;
  //   }
  // }
  return true;
}
