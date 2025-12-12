"use server";

import { Prisma } from "@/lib/infra/prisma";
import { getSession } from "@/lib/session/session";
import { getHotspots } from "../../../hotspots/_services/get-hotspots";

export interface CanCreatePortalResponse {
  able: boolean;
  maxPortals: number;
}

export async function canCreatePortal(): Promise<CanCreatePortalResponse> {
  const session = await getSession();
  if (!session?.userId) {
    return { able: false, maxPortals: 0 };
  }

  const hotspots = await getHotspots(1, 150);

  const hotspotCount = hotspots.meta.total;
  if (hotspotCount === 0) {
    return { able: false, maxPortals: 0 };
  }

  const portals = await Prisma.portal_config.count({
    where: { user_id: session.userId },
  });

  if (portals == hotspotCount) {
    return { able: false, maxPortals: hotspotCount };
  }

  return { able: true, maxPortals: hotspotCount };
}
