import {
  DeviceConfig,
  UpdateConfigFragmentDto,
  ConfigFragmentResponse,
} from "./types";
import { env } from "@/lib/infra/env";

export default async function updateDeviceConfig(
  fragmentId: number,
  name: string,
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
  const dto: UpdateConfigFragmentDto = {
    name,
    fragment,
    enabled,
    priority,
  };

  try {
    const response = await fetch(
      `${env.DEVICES_API_URL}/device_config/fragments?id=${fragmentId}`,
      {
        method: "PUT",
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
        `Failed to update device config: ${response.status} - ${errorText}`,
      );
      return false;
    }

    const result: ConfigFragmentResponse = await response.json();

    // Return the fragment as DeviceConfig format
    return true;
  } catch (error) {
    console.error("Error updating device config:", error);
    return false;
  }
}
