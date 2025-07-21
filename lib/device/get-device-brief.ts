import { env } from "@/lib/infra/env";
import { DeviceBrief } from "./types";

export default async function getDeviceBrief(
  wayru_device_id: string,
): Promise<DeviceBrief | null> {
  const device_data_result = await fetch(
    `${env.WIFI_API_URL}/devices/${wayru_device_id}/brief`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${env.WIFI_API_KEY}`,
      },
    },
  );

  if (!device_data_result.ok) {
    return null;
  }

  const deviceBrief: DeviceBrief = await device_data_result.json();
  return deviceBrief;
}
