import { Prisma } from "@/lib/infra/prisma";
import { Hotspot } from "./get-hotspots";

export default async function ensureHotspots(hotspots: Hotspot[]) {
  if (!hotspots || hotspots.length === 0) {
    return;
  }

  // Filter out hotspots without wayru_device_id
  const validHotspots = hotspots.filter(
    (hotspot) =>
      hotspot.wayru_device_id && hotspot.wayru_device_id.trim() !== "",
  );

  if (validHotspots.length === 0) {
    return;
  }

  // Use interactive transaction for proper error handling
  try {
    await Prisma.$transaction(async (tx) => {
      for (const hotspot of validHotspots) {
        await tx.hotspot.upsert({
          where: {
            wayru_device_id: hotspot.wayru_device_id,
          },
          update: {
            name: hotspot.name,
          },
          create: {
            wayru_device_id: hotspot.wayru_device_id,
            name: hotspot.name,
          },
        });
      }
    });
  } catch (error) {
    console.error("Error ensuring hotspots:", error);
    return;
  }
}
