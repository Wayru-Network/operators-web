"use server";
import { Prisma } from "@/lib/infra/prisma";
import { getSession } from "@/lib/session/session";
import { env } from "@/lib/infra/env";
import ensureHotspots from "./ensure-hotspots";
import getConnectivity from "@/lib/device/get-connectivity";
import { getHotspotBySubscription } from "@/app/api/hotspots/_services/hotspots-service";

export interface Hotspot {
  id: number;
  name: string;
  status: "online" | "offline" | "unknown";
  mac: string;
  latitude: string;
  longitude: string;
  solana_asset_id: string;
  nfnode_type: string;
  wayru_device_id: string;
  assigned_portal?: string;
}
export interface MinersByAddressResponse {
  data: Hotspot[];
  meta: {
    total: number;
    pages: number;
    page: number;
    size: number;
  };
}

export async function getHotspots(
  page: number,
  limit: number
): Promise<MinersByAddressResponse> {
  const { wallet } = await getSession();

  if (!wallet) {
    return {
      data: [],
      meta: {
        total: 0,
        pages: 0,
        page: 0,
        size: 0,
      },
    };
  }

  let hotspotsData;

  try {
    hotspotsData = await fetch(
      `${env.BACKEND_URL}/api/nfnode/miners-by-address/${wallet}?page=${page}&limit=${limit}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": env.BACKEND_KEY,
        },
      }
    );
  } catch (error) {
    console.error("Error fetching hotspots:", error);
    return {
      data: [],
      meta: {
        total: 0,
        pages: 0,
        page: 0,
        size: 0,
      },
    };
  }

  let hotspots: MinersByAddressResponse;
  try {
    hotspots = (await hotspotsData.json()) as MinersByAddressResponse;
    if (!hotspots || hotspots.data.length === 0) {
      return {
        data: [],
        meta: {
          total: 0,
          pages: 0,
          page: 0,
          size: 0,
        },
      };
    }
  } catch (error) {
    console.error("Error fetching hotspots:", error);
    return {
      data: [],
      meta: {
        total: 0,
        pages: 0,
        page: 0,
        size: 0,
      },
    };
  }

  const wayruDeviceIds = hotspots.data
    .filter(
      (hotspot) =>
        hotspot.wayru_device_id && hotspot.wayru_device_id.trim() !== ""
    )
    .map((hotspot) => hotspot.wayru_device_id);

  // Get the device connectivity status
  const deviceConnectivity = await getConnectivity(wayruDeviceIds);

  // Map device IDs to their connectivity status
  if (!deviceConnectivity || deviceConnectivity.length === 0) {
    hotspots.data.forEach((hotspot) => {
      hotspot.status = "unknown";
    });
  } else {
    const deviceConnectivityMap = new Map(
      deviceConnectivity.map((status) => [status.deviceId, status.status])
    );

    hotspots.data.forEach((hotspot) => {
      hotspot.status =
        deviceConnectivityMap.get(hotspot.wayru_device_id) || "unknown";
    });
  }

  // Ensure all valid hotspots are recorded in the database
  await ensureHotspots(hotspots.data);

  const portals = await Prisma.hotspot.findMany({
    where: {
      wayru_device_id: {
        in: wayruDeviceIds,
      },
    },
    include: {
      portal_config: true,
    },
  });

  const portalMap = new Map();
  portals.forEach((hotspot) => {
    if (hotspot.portal_config_id && hotspot.portal_config) {
      portalMap.set(hotspot.wayru_device_id, hotspot.portal_config.portal_name);
    }
  });

  hotspots.data.forEach((hotspot) => {
    hotspot.assigned_portal = portalMap.get(hotspot.wayru_device_id) || "None";
  });

  return hotspots;
}

export async function getHotspotsToAssignCaptivePortal(): Promise<Hotspot[]> {
  const hotspots = await getHotspotBySubscription();
  console.log("Fetched hotspots:", hotspots?.length);
  return hotspots as unknown as Hotspot[];
}
