import { PrismaClient } from "@prisma/client/extension";

export async function assignHotspots(
  hotspotIds: string[],
  portalConfigId: number,
  tx: PrismaClient
) {
  await Promise.all(
    hotspotIds.map((deviceId) =>
      tx.hotspot.upsert({
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
}
