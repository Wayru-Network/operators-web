import { Prisma } from "@/lib/infra/prisma";

export async function assignHotspots(
  hotspotIds: string[],
  portalConfigId: number
) {
  try {
    await Promise.all(
      hotspotIds.map((deviceId) =>
        Prisma.hotspot.upsert({
          where: { wayru_device_id: deviceId },
          update: {
            portal_config: { connect: { id: portalConfigId } },
          },
          create: {
            wayru_device_id: deviceId,
            portal_config: { connect: { id: portalConfigId } },
          },
        })
      )
    );

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Failed to assign hotspots to portal config",
    };
  }
}
