"use server";

import { randomUUID } from "crypto";
import {
  HotspotNetworksFormData,
  SaveHotspotNetworksResponse,
} from "../_types/hotspot-networks";
import { Prisma } from "@/lib/infra/prisma";

// Placeholder function that simulates a network call
async function createNetworkConfigOnDevice(config: {
  ssid: string;
  type: "open" | "private";
  password?: string;
}): Promise<string> {
  console.log(config);

  // Simulate network call delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Return the ID that will be used for the configuration
  return randomUUID();
}

export default async function saveHotspotNetworks(
  data: HotspotNetworksFormData,
): Promise<SaveHotspotNetworksResponse> {
  try {
    console.log("Location name:", data.locationName);

    // Check if hotspot exists
    const hotspot = await Prisma.hotspot.findUnique({
      where: { name: data.name },
      include: { network_configs: true },
    });

    if (!hotspot) {
      return { success: false, error: "Hotspot not found" };
    }

    // Check if open network config already exists
    const existingOpenConfig = hotspot.network_configs.find(
      (config) => config.type === "open",
    );

    // Create open network config if it doesn't exist and SSID is provided
    if (!existingOpenConfig && data.openNetwork.ssid.trim()) {
      const deviceConfigId = await createNetworkConfigOnDevice({
        ssid: data.openNetwork.ssid,
        type: "open",
      });

      await Prisma.network_config.create({
        data: {
          device_config_id: deviceConfigId,
          device_config: {
            ssid: data.openNetwork.ssid,
            type: "open",
          },
          hotspot_id: hotspot.id,
          type: "open",
        },
      });
    }

    // Check if private network config already exists
    const existingPrivateConfig = hotspot.network_configs.find(
      (config) => config.type === "private",
    );

    // Create private network config if it doesn't exist and SSID is provided
    if (!existingPrivateConfig && data.privateNetwork.ssid.trim()) {
      const deviceConfigId = await createNetworkConfigOnDevice({
        ssid: data.privateNetwork.ssid,
        type: "private",
        password: data.privateNetwork.password,
      });

      await Prisma.network_config.create({
        data: {
          device_config_id: deviceConfigId,
          device_config: {
            ssid: data.privateNetwork.ssid,
            password: data.privateNetwork.password,
            type: "private",
          },
          hotspot_id: hotspot.id,
          type: "private",
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error saving hotspot networks:", error);
    return {
      success: false,
      error: "Failed to save network configurations",
    };
  }
}
