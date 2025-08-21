import saveHotspotNetworks from "@/app/[lang]/(operator)/hotspots/[hotspot]/_services/save-hotspot-networks";
import { HotspotNetworksFormData } from "@/app/[lang]/(operator)/hotspots/[hotspot]/_types/hotspot-networks";
import { Prisma } from "@/lib/infra/prisma";

interface setDefaultProps {
  userId: string;
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
    password: "default-password",
  },
};

export default async function setDefaultSettings({
  userId,
  hotspot_name,
}: setDefaultProps): Promise<setDefaultResponse> {
  console.log("Setting default settings for user:", userId);
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
