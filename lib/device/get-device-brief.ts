import { env } from "@/lib/infra/env";
import { DeviceBrief } from "./types";

export default async function getDeviceBrief(
  wayru_device_id: string
): Promise<DeviceBrief | null> {
  let device_data_result: Response;
  try {
    device_data_result = await fetch(
      `${env.WIFI_API_URL}/devices/${wayru_device_id}/brief`,
      {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${env.WIFI_API_KEY}`,
        },
      }
    );

    if (!device_data_result.ok) {
      return null;
    }
  } catch (error) {
    console.error("Error fetching device brief:", error);
    return null;
  }

  const deviceBrief: DeviceBrief = await device_data_result.json();
  return deviceBrief;
}
