import {
  DeviceConfig,
  CreateConfigFragmentDto,
  ConfigFragmentResponse,
} from "./types";
import { env } from "@/lib/infra/env";

export default async function createDeviceConfig(
  deviceId?: string,
  groupId?: string,
  type: "device" | "group" | "system" = "device",
  name: string = "default-config",
  fragment: DeviceConfig = {
    device_config: {
      wireless: [],
      opennds: [],
      wayru: [],
    },
  },
  enabled: boolean = true,
  priority: number = 0,
): Promise<boolean> {
  const dto: CreateConfigFragmentDto = {
    type,
    name,
    fragment,
    enabled,
    priority,
  };

  // Add device_id or group_id based on type
  if (type === "device" && deviceId) {
    dto.device_id = deviceId;
  } else if (type === "group" && groupId) {
    dto.group_id = groupId;
  }

  try {
    const response = await fetch(
      `${env.DEVICES_API_URL}/device_config/fragments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.DEVICES_API_KEY}`,
        },
        body: JSON.stringify(dto),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Failed to create device config: ${response.status} - ${errorText}`,
      );
      return false;
    }

    const result: ConfigFragmentResponse = await response.json();

    // Return the fragment as DeviceConfig format
    return true;
  } catch (error) {
    console.error("Error creating device config:", error);
    return false;
  }
}
