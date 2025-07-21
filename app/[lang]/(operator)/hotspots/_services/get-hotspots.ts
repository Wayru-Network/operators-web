"use server";
import { Prisma } from "@/lib/infra/prisma";
import { getSession } from "@/lib/session/session";
import { env } from "@/lib/infra/env";

export interface Hotspot {
  id: number;
  name: string;
  status: string;
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

  const hotspotsData = await fetch(
    `${
      env.BACKEND_URL
    }/api/nfnode/miners-by-address/${wallet}?page=${page}&size=${limit}&limit=${6}`,
    {
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": env.BACKEND_KEY,
      },
    }
  );

  const hotspots = (await hotspotsData.json()) as MinersByAddressResponse;
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

  const wayruDeviceIds = hotspots.data
    .filter((hotspot) => hotspot.wayru_device_id !== null)
    .map((hotspot) => hotspot.wayru_device_id);

  const portals = await Prisma.hotspot.findMany({
    where: {
      wayru_device_id: {
        in: wayruDeviceIds,
      },
    },
    include: {
      portal_configs: true,
    },
  });

  const portalMap = new Map();
  portals.forEach((hotspot) => {
    if (hotspot.portal_configs && hotspot.portal_configs.length > 0) {
      portalMap.set(
        hotspot.wayru_device_id,
        hotspot.portal_configs[0].portal_name
      );
    }
  });

  hotspots.data.forEach((hotspot) => {
    hotspot.assigned_portal = portalMap.get(hotspot.wayru_device_id) || "None";
  });

  return hotspots;
}

export async function getHotspotsToAssign(): Promise<Hotspot[]> {
  const hotspots = await getHotspots(1, 5); // Get all hotspots
  return hotspots.data;
}
