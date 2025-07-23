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
): Promise<string | null> {
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
      return null;
    }

    const result: ConfigFragmentResponse = await response.json();

    // Return the fragment ID
    return result.id.toString();
  } catch (error) {
    console.error("Error updating device config:", error);
    return null;
  }
}
