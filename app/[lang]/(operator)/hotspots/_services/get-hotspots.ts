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
}

export async function getHotspots(page = 1, limit = 10): Promise<Hotspot[]> {
  const { wallet } = await getSession();

  if (!wallet) {
    return [];
  }

  const hotspotsData = await fetch(
    `${env.BACKEND_URL}/api/nfnode/miners-by-address/${wallet}?page=${page}&limit=${limit}`,
    {
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": env.BACKEND_KEY,
      },
    },
  );

  const hotspots = (await hotspotsData.json()) as MinersByAddressResponse;
  if (!hotspots || hotspots.data.length === 0) {
    return [] as Hotspot[];
  }

  const wayruDeviceIds = hotspots.data.map(
    (hotspot) => hotspot.wayru_device_id,
  );

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
        hotspot.portal_configs[0].portal_name,
      );
    }
  });

  hotspots.data.forEach((hotspot) => {
    hotspot.assigned_portal = portalMap.get(hotspot.wayru_device_id) || "None";
  });

  return hotspots.data;
}

export async function getHotspotsMock(page = 1, limit = 6): Promise<Hotspot[]> {
  const totalItems = 20;
  const allHotspots: Hotspot[] = [];

  for (let i = 1; i <= totalItems; i++) {
    allHotspots.push({
      id: i,
      name: `Hotspot-${i}`,
      status: i % 2 === 0 ? "active" : "inactive",
      mac: `00:11:22:33:44:${(10 + i).toString(16).padStart(2, "0")}`,
      latitude: (10 + i * 0.01).toFixed(5),
      longitude: (-75 - i * 0.01).toFixed(5),
      solana_asset_id: `asset-${i}`,
      nfnode_type: "type-A",
      wayru_device_id: `device-${i}`,
      assigned_portal: `Portal-${(i % 3) + 1}`,
    });
  }

  // Paginar slice
  const start = (page - 1) * limit;
  const end = start + limit;

  return allHotspots.slice(start, end);
}

export async function getDefaultHotspots(): Promise<Hotspot[]> {
  return [
    {
      id: 1,
      name: "Central-Park-AP",
      status: "Online",
      mac: "00:1A:2B:3C:4D:5E",
      latitude: "40.785091",
      longitude: "-73.968285",
      solana_asset_id: "asset-1",
      nfnode_type: "type-1",
      wayru_device_id: "c1a2b3c4-5d6e-7f8a-9b0c-1d2e3f4a5b6c",
    },
    {
      id: 2,
      name: "Library-WiFi",
      status: "Offline",
      mac: "11:22:33:44:55:66",
      latitude: "40.753182",
      longitude: "-73.982253",
      solana_asset_id: "asset-2",
      nfnode_type: "type-2",
      wayru_device_id: "d2e3f4a5-b6c7-8d9e-0f1a-2b3c4d5e6f7a",
    },
    {
      id: 3,
      name: "Mall-Entrance",
      status: "Online",
      mac: "AA:BB:CC:DD:EE:FF",
      latitude: "40.758896",
      longitude: "-73.985130",
      solana_asset_id: "asset-3",
      nfnode_type: "type-3",
      wayru_device_id: "e3f4a5b6-c7d8-9e0f-1a2b-3c4d5e6f7a8b",
    },
    {
      id: 4,
      name: "Airport-Lounge",
      status: "Offline",
      mac: "12:34:56:78:9A:BC",
      latitude: "40.641311",
      longitude: "-73.778139",
      solana_asset_id: "asset-4",
      nfnode_type: "type-4",
      wayru_device_id: "f4a5b6c7-d8e9-0f1a-2b3c-4d5e6f7a8b9c",
    },
    {
      id: 5,
      name: "Coffee-Shop",
      status: "Online",
      mac: "FE:DC:BA:98:76:54",
      latitude: "40.730610",
      longitude: "-73.935242",
      solana_asset_id: "asset-5",
      nfnode_type: "type-5",
      wayru_device_id: "a5b6c7d8-e9f0-1a2b-3c4d-5e6f7a8b9c0d",
    },
    {
      id: 6,
      name: "University-Hall",
      status: "Offline",
      mac: "01:23:45:67:89:AB",
      latitude: "40.729513",
      longitude: "-73.996461",
      solana_asset_id: "asset-6",
      nfnode_type: "type-6",
      wayru_device_id: "b6c7d8e9-f0a1-2b3c-4d5e-6f7a8b9c0d1e",
    },
  ];
}
