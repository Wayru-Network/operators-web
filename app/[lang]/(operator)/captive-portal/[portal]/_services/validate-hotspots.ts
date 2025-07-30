import { PortalConfig } from "../_components/customize-captive-portal";
import { Prisma } from "@/lib/infra/prisma";
export default async function validateHotspots(
  newConfig: PortalConfig,
  originalConfig: PortalConfig
): Promise<{
  success: boolean;
  error?: string;
}> {
  if (
    newConfig.assignedHotspot.length === originalConfig.assignedHotspot.length
  ) {
    if (originalConfig.assignedHotspot.length === 0) {
      return { success: false };
    }
  }

  const newHotspotIds = newConfig.assignedHotspot.map((h) => h.wayru_device_id);

  if (newHotspotIds.length === 0) {
    await Prisma.portal_config.update({
      where: { id: newConfig.id },
      data: {
        hotspots: {
          disconnect: originalConfig.assignedHotspot.map((h) => ({
            wayru_device_id: h.wayru_device_id,
          })),
        },
      },
    });
    return { success: true };
  }

  const oldHotspotIds = originalConfig.assignedHotspot.map(
    (h) => h.wayru_device_id
  );

  const sortedNewIds = [...newHotspotIds].sort();
  const sortedOldIds = [...oldHotspotIds].sort();

  const areHotspotsEqual =
    sortedNewIds.length === sortedOldIds.length &&
    sortedNewIds.every((id, idx) => id === sortedOldIds[idx]);

  if (!areHotspotsEqual) {
    try {
      await Promise.all(
        sortedNewIds.map((deviceId) =>
          Prisma.hotspot.upsert({
            where: { wayru_device_id: deviceId },
            update: {
              portal_config: { connect: { id: newConfig.id } },
            },
            create: {
              wayru_device_id: deviceId,
              portal_config: { connect: { id: newConfig.id } },
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
  return {
    success: false,
  };
}
