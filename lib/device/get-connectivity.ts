import { env } from "@/lib/infra/env";
import {
  DeviceConnectivityDto,
  DeviceConnectivityResponse,
  DeviceConnectivityStatus,
} from "./types";

export default async function getConnectivity(
  wayru_device_ids: string[]
): Promise<DeviceConnectivityStatus[] | null> {
  try {
    const body: DeviceConnectivityDto = {
      device_ids: wayru_device_ids,
    };

    const device_connectivity_response = await fetch(
      `${env.WIFI_API_URL}/devices/connectivity`,
      {
        method: "POST",
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${env.WIFI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!device_connectivity_response.ok) {
      console.log("Failed to fetch connectivity data");
      console.log(device_connectivity_response.status);
      return null;
    }

    const response: DeviceConnectivityResponse =
      await device_connectivity_response.json();

    //console.log(response);

    return response.connectivityResults;
  } catch (err) {
    console.error(err);
    return null;
  }
}
