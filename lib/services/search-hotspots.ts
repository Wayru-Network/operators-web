import { env } from "@/lib/infra/env";
import { MinersByAddressResponse } from "@/app/[lang]/(operator)/hotspots/_services/get-hotspots";
import { getSession } from "../session/session";
import ensureHotspots from "@/app/[lang]/(operator)/hotspots/_services/ensure-hotspots";
import getConnectivity from "@/lib/device/get-connectivity";
import { Prisma } from "@/lib/infra/prisma";

export async function searchHotspots(
  query: string,
  page: number,
  limit: number
): Promise<MinersByAddressResponse> {
  const { wallet } = await getSession();

  const url = `${
    env.BACKEND_URL
  }/api/nfnode/miners-by-query/${wallet}/${encodeURIComponent(
    query
  )}?page=${page}&limit=${limit}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": env.BACKEND_KEY,
    },
  });

  if (!res.ok) {
    console.error("Search failed:", await res.text());
    return {
      data: [],
      meta: {
        total: 0,
        pages: 0,
        page: 1,
        size: 0,
      },
    };
  }

  const hotspots = (await res.json()) as MinersByAddressResponse;

  if (!hotspots || hotspots.data.length === 0) {
    return {
      data: [],
      meta: {
        total: 0,
        pages: 0,
        page,
        size: limit,
      },
    };
  }

  const wayruDeviceIds = hotspots.data
    .filter((h) => h.wayru_device_id?.trim() !== "")
    .map((h) => h.wayru_device_id);

  const deviceConnectivity = await getConnectivity(wayruDeviceIds);

  if (!deviceConnectivity || deviceConnectivity.length === 0) {
    hotspots.data.forEach((h) => {
      h.status = "unknown";
    });
  } else {
    const deviceConnectivityMap = new Map(
      deviceConnectivity.map((status) => [status.deviceId, status.status])
    );

    hotspots.data.forEach((h) => {
      h.status = deviceConnectivityMap.get(h.wayru_device_id) || "unknown";
    });
  }
  await ensureHotspots(hotspots.data);

  const portals = await Prisma.hotspot.findMany({
    where: {
      wayru_device_id: { in: wayruDeviceIds },
    },
    include: {
      portal_config: true,
    },
  });

  const portalMap = new Map();
  portals.forEach((h) => {
    if (h.portal_config_id && h.portal_config) {
      portalMap.set(h.wayru_device_id, h.portal_config.portal_name);
    }
  });

  hotspots.data.forEach((h) => {
    h.assigned_portal = portalMap.get(h.wayru_device_id) || "None";
  });

  return {
    data: hotspots.data,
    meta: {
      total: hotspots.data.length,
      pages: hotspots.meta.pages,
      page,
      size: hotspots.data.length,
    },
  };
}
