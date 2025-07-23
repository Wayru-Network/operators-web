"use server";

import {
  HotspotNetworksFormData,
  SaveHotspotNetworksResponse,
} from "../_types/hotspot-networks";
import { Prisma } from "@/lib/infra/prisma";
import { DeviceConfig } from "@/lib/device_config/types";
import createDeviceConfig from "@/lib/device_config/create-device-config";
import updateDeviceConfig from "@/lib/device_config/update-device-config";

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

    // Check for existing configs
    const existingOpenConfig = hotspot.network_configs.find(
      (config) => config.type === "open",
    );
    const existingPrivateConfig = hotspot.network_configs.find(
      (config) => config.type === "private",
    );

    // Handle open network configuration
    if (data.openNetwork.ssid.trim()) {
      const openConfig: DeviceConfig = {
        device_config: {
          wireless: [
            {
              meta_config: "wireless",
              meta_type: "wifi-iface",
              meta_section: "captive_wifi_2ghz",
              ssid: data.openNetwork.ssid,
            },
            {
              meta_config: "wireless",
              meta_type: "wifi-iface",
              meta_section: "captive_wifi_5ghz",
              ssid: data.openNetwork.ssid,
            },
          ],
        },
      };

      let deviceConfigId: string | null = null;

      if (existingOpenConfig) {
        // Update existing config
        const fragmentId = parseInt(existingOpenConfig.device_config_id);
        deviceConfigId = await updateDeviceConfig(
          fragmentId,
          "open-network-config",
          openConfig,
          true,
          0,
        );

        if (deviceConfigId) {
          await Prisma.network_config.update({
            where: { id: existingOpenConfig.id },
            data: {
              device_config_id: deviceConfigId,
              device_config: {
                ssid: data.openNetwork.ssid,
                type: "open",
              },
            },
          });
        }
      } else {
        // Create new config
        deviceConfigId = await createDeviceConfig(
          hotspot.wayru_device_id,
          undefined,
          "device",
          "open-network-config",
          openConfig,
          true,
          0,
        );

        if (deviceConfigId) {
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
      }

      if (!deviceConfigId) {
        return { success: false, error: "Failed to configure open network" };
      }
    }

    // Handle private network configuration
    if (data.privateNetwork.ssid.trim()) {
      const privateConfig: DeviceConfig = {
        device_config: {
          wireless: [
            {
              meta_config: "wireless",
              meta_type: "wifi-iface",
              meta_section: "default_wifi_interface_0",
              ssid: data.privateNetwork.ssid,
            },
            {
              meta_config: "wireless",
              meta_type: "wifi-iface",
              meta_section: "default_wifi_interface_1",
              ssid: data.privateNetwork.ssid,
            },
          ],
        },
      };

      let deviceConfigId: string | null = null;

      if (existingPrivateConfig) {
        // Update existing config
        const fragmentId = parseInt(existingPrivateConfig.device_config_id);
        deviceConfigId = await updateDeviceConfig(
          fragmentId,
          "private-network-config",
          privateConfig,
          true,
          0,
        );

        if (deviceConfigId) {
          await Prisma.network_config.update({
            where: { id: existingPrivateConfig.id },
            data: {
              device_config_id: deviceConfigId,
              device_config: {
                ssid: data.privateNetwork.ssid,
                password: data.privateNetwork.password,
                type: "private",
              },
            },
          });
        }
      } else {
        // Create new config
        deviceConfigId = await createDeviceConfig(
          hotspot.wayru_device_id,
          undefined,
          "device",
          "private-network-config",
          privateConfig,
          true,
          0,
        );

        if (deviceConfigId) {
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
      }

      if (!deviceConfigId) {
        return { success: false, error: "Failed to configure private network" };
      }
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
