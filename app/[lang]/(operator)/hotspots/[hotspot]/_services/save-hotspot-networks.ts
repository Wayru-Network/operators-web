"use server";

import {
  HotspotNetworksFormData,
  SaveHotspotNetworksResponse,
} from "../_types/hotspot-networks";
import { Prisma } from "@/lib/infra/prisma";
import { DeviceConfig } from "@/lib/device_config/types";
import createDeviceConfig from "@/lib/device_config/create-device-config";
import updateDeviceConfig from "@/lib/device_config/update-device-config";
import { validateDeviceConfig } from "@/lib/device_config/validate-device-config";

export default async function saveHotspotNetworks(
  newData: HotspotNetworksFormData
): Promise<SaveHotspotNetworksResponse> {
  try {
    console.log("Location name:", newData.locationName);

    // Check if hotspot exists
    const hotspot = await Prisma.hotspot.findUnique({
      where: { name: newData.name },
      include: { network_configs: true },
    });

    if (!hotspot) {
      return { success: false, error: "Hotspot not found" };
    }

    // Update Location Name
    if (newData.locationName && newData.locationName.trim() !== "") {
      await Prisma.hotspot.update({
        where: { id: hotspot.id },
        data: { location_name: newData.locationName },
      });
    }

    // Check for existing configs
    const existingOpenConfig = hotspot.network_configs.find(
      (config) => config.type === "open"
    );
    const existingPrivateConfig = hotspot.network_configs.find(
      (config) => config.type === "private"
    );

    // Handle open network configuration
    if (newData.openNetwork.ssid.trim()) {
      const openConfig: DeviceConfig = {
        device_config: {
          wireless: [
            {
              meta_config: "wireless",
              meta_type: "wifi-iface",
              meta_section: "captive_wifi_2ghz",
              ssid: newData.openNetwork.ssid,
            },
            {
              meta_config: "wireless",
              meta_type: "wifi-iface",
              meta_section: "captive_wifi_5ghz",
              ssid: newData.openNetwork.ssid,
            },
          ],
        },
      };

      // Validate the device config before proceeding
      if (!validateDeviceConfig(openConfig)) {
        return { success: false, error: "Invalid open network configuration" };
      }

      let deviceConfigId: number | null = null;

      if (existingOpenConfig) {
        // Update existing config
        const fragmentId = existingOpenConfig.device_config_id;
        deviceConfigId = await updateDeviceConfig(
          fragmentId,
          "open-network-config",
          openConfig,
          true,
          0
        );

        if (deviceConfigId) {
          await Prisma.network_config.update({
            where: { id: existingOpenConfig.id },
            data: {
              device_config_id: deviceConfigId,
              device_config: JSON.parse(JSON.stringify(openConfig)),
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
          0
        );

        if (deviceConfigId) {
          await Prisma.network_config.create({
            data: {
              device_config_id: deviceConfigId,
              device_config: JSON.parse(JSON.stringify(openConfig)),
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
    if (newData.privateNetwork.ssid.trim()) {
      const privateConfig: DeviceConfig = {
        device_config: {
          wireless: [
            {
              meta_config: "wireless",
              meta_type: "wifi-iface",
              meta_section: "default_wifi_interface_0",
              ssid: newData.privateNetwork.ssid,
              key: newData.privateNetwork.password,
            },
            {
              meta_config: "wireless",
              meta_type: "wifi-iface",
              meta_section: "default_wifi_interface_1",
              ssid: newData.privateNetwork.ssid,
              key: newData.privateNetwork.password,
            },
          ],
        },
      };

      // Validate the device config before proceeding
      if (!validateDeviceConfig(privateConfig)) {
        return {
          success: false,
          error: "Invalid private network configuration",
        };
      }

      let deviceConfigId: number | null = null;

      if (existingPrivateConfig) {
        // Update existing config
        const fragmentId = existingPrivateConfig.device_config_id;
        deviceConfigId = await updateDeviceConfig(
          fragmentId,
          "private-network-config",
          privateConfig,
          true,
          0
        );

        if (deviceConfigId) {
          await Prisma.network_config.update({
            where: { id: existingPrivateConfig.id },
            data: {
              device_config_id: deviceConfigId,
              device_config: JSON.parse(JSON.stringify(privateConfig)),
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
          0
        );

        if (deviceConfigId) {
          await Prisma.network_config.create({
            data: {
              device_config_id: deviceConfigId,
              device_config: JSON.parse(JSON.stringify(privateConfig)),
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
