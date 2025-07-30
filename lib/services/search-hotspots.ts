import { env } from "@/lib/infra/env";
import { MinersByAddressResponse } from "@/app/[lang]/(operator)/hotspots/_services/get-hotspots";
import { getSession } from "../session/session";
import { Hotspot } from "@/app/[lang]/(operator)/hotspots/_services/get-hotspots";
import ensureHotspots from "@/app/[lang]/(operator)/hotspots/_services/ensure-hotspots";
import getConnectivity from "@/lib/device/get-connectivity";
import { Prisma } from "@/lib/infra/prisma";

export async function searchHotspots(
  query: string
): Promise<MinersByAddressResponse> {
  const { wallet } = await getSession();

  const url = `${
    env.BACKEND_URL
  }/api/nfnode/miners-by-query/${wallet}/${encodeURIComponent(query)}`;
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

  const hotspots = (await res.json()) as Hotspot[];

  if (!hotspots || hotspots.length === 0) {
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

  const wayruDeviceIds = hotspots
    .filter((h) => h.wayru_device_id?.trim() !== "")
    .map((h) => h.wayru_device_id);

  const deviceConnectivity = await getConnectivity(wayruDeviceIds);

  if (!deviceConnectivity || deviceConnectivity.length === 0) {
    hotspots.forEach((h) => {
      h.status = "unknown";
    });
  } else {
    const deviceConnectivityMap = new Map(
      deviceConnectivity.map((status) => [status.deviceId, status.status])
    );

    hotspots.forEach((h) => {
      h.status = deviceConnectivityMap.get(h.wayru_device_id) || "unknown";
    });
  }
  await ensureHotspots(hotspots);

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

  hotspots.forEach((h) => {
    h.assigned_portal = portalMap.get(h.wayru_device_id) || "None";
  });

  return {
    data: hotspots,
    meta: {
      total: hotspots.length,
      pages: 1,
      page: 1,
      size: hotspots.length,
    },
  };
}
