"use server";
//import saveHotspotNetworks from "@/app/[lang]/(operator)/hotspots/[hotspot]/_services/save-hotspot-networks";
//import { HotspotNetworksFormData } from "@/app/[lang]/(operator)/hotspots/[hotspot]/_types/hotspot-networks";
import { Prisma } from "@/lib/infra/prisma";
import { getHotspotBySubscription } from "@/app/api/hotspots/_services/hotspots-service";
// import { env } from "@/lib/infra/env";

interface setDefaultProps {
  hotspot_name: string;
}

interface setDefaultResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// const defaultSettings: HotspotNetworksFormData = {
//   locationName: "Unknown",
//   name: "Default Hotspot",
//   openNetwork: {
//     ssid: ".Wayru Wifi",
//   },
//   privateNetwork: {
//     ssid: "Wayru Operator",
//     password: env.DEFAULT_PRIVATE_SSID_PW || "admin",
//   },
// };

export default async function setHotspotsDefaultSettings(): Promise<setDefaultResponse> {
  const hotspots = await getHotspotBySubscription();
  if (!hotspots) {
    return { success: false, error: "No hotspots found for the subscription" };
  } else {
    console.log(hotspots);
  }

  for (const hotspot of hotspots) {
    const result = await setDefaultSettings({
      hotspot_name: hotspot.name ?? "",
    });
    if (!result.success) {
      return { success: false, error: result.error };
    }
  }

  return { success: true };
}

async function setDefaultSettings({
  hotspot_name,
}: setDefaultProps): Promise<setDefaultResponse> {
  console.log("Setting default settings for device:", hotspot_name);
  try {
    const assignedPortalId = await Prisma.hotspot.findUnique({
      where: { name: hotspot_name },
      select: { portal_config_id: true },
    });

    if (assignedPortalId?.portal_config_id) {
      await Prisma.ad.updateMany({
        where: { portal_config_id: assignedPortalId.portal_config_id },
        data: { portal_config_id: null },
      });
    }

    await Prisma.hotspot.update({
      where: { name: hotspot_name },
      data: {
        subscription: {
          disconnect: true,
        },
      },
    });
    // defaultSettings.name = hotspot_name;

    // const result = await saveHotspotNetworks(defaultSettings);
    // if (!result.success) {
    //   throw new Error(result.error);
    // }
  } catch (error) {
    console.error("Error revoking subscription:", error);
    return { success: false, error: `Failed to revoke subscription: ${error}` };
  }

  return { success: true, message: "Default settings applied successfully" };
}

interface revokeSubscriptionResponse {
  success: boolean;
  error?: string;
}

export async function revokeSubscription(
  sub_id: string
): Promise<revokeSubscriptionResponse> {
  try {
    const subscription = await Prisma.subscriptions.findUnique({
      where: { stripe_subscription_id: sub_id },
    });
    if (subscription) {
      await Prisma.subscriptions.delete({
        where: { id: subscription.id },
      });
      const customer = await Prisma.customers.findUnique({
        where: { id: subscription.customer_id },
        select: { customer_uuid: true },
      });

      if (!customer?.customer_uuid) {
        return { success: false, error: "Not found" };
      }

      const portals = await Prisma.portal_config.findMany({
        where: { user_id: customer?.customer_uuid },
        select: { id: true },
      });

      for (const portal of portals) {
        await Prisma.ad.updateMany({
          where: { portal_config_id: portal.id },
          data: { portal_config_id: null },
        });
      }
      return { success: true };
    } else {
      console.warn(`Subscription with id ${sub_id} not found.`);
      return {
        success: false,
        error: `Sub not found`,
      };
    }
  } catch (error) {
    console.error("Error revoking subscription:", error);
    throw new Error(`Failed to revoke subscription: ${error}`);
  }
}

interface pauseSubscriptionResponse {
  success: boolean;
  error?: string;
}

export async function pauseSubscription(
  sub_id: string
): Promise<pauseSubscriptionResponse> {
  try {
    await Prisma.subscriptions.update({
      where: { stripe_subscription_id: sub_id },
      data: { is_valid: false },
    });

    return { success: true };
  } catch (error) {
    console.error("Error pausing subscription:", error);
    throw new Error(`Failed to pause subscription: ${error}`);
  }
}
