"use server";
import saveHotspotNetworks from "@/app/[lang]/(operator)/hotspots/[hotspot]/_services/save-hotspot-networks";
import { HotspotNetworksFormData } from "@/app/[lang]/(operator)/hotspots/[hotspot]/_types/hotspot-networks";
import { Prisma } from "@/lib/infra/prisma";
import { getHotspotBySubscription } from "@/app/api/hotspots/_services/hotspots-service";
import { env } from "@/lib/infra/env";

interface setDefaultProps {
  hotspot_name: string;
}

interface setDefaultResponse {
  success: boolean;
  message?: string;
  error?: string;
}

const defaultSettings: HotspotNetworksFormData = {
  locationName: "Unknown",
  name: "Default Hotspot",
  openNetwork: {
    ssid: ".Wayru Wifi",
  },
  privateNetwork: {
    ssid: "Wayru Operator",
    password: env.DEFAULT_PRIVATE_SSID_PW || "admin",
  },
};

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
    await Prisma.hotspot.update({
      where: { name: hotspot_name },
      data: {
        location_name: "Unknown",
        portal_config: {
          disconnect: true,
        },
        subscription: {
          disconnect: true,
        },
      },
    });

    defaultSettings.name = hotspot_name;

    const result = await saveHotspotNetworks(defaultSettings);
    if (!result.success) {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Error revoking subscription:", error);
    return { success: false, error: `Failed to revoke subscription: ${error}` };
  }

  return { success: true, message: "Default settings applied successfully" };
}
