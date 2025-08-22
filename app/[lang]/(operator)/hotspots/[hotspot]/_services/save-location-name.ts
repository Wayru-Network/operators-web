"use server";
import { Prisma } from "@/lib/infra/prisma";
import {
  LocationNameFormData,
  SaveLocationNameResponse,
} from "../_types/hotspot-networks";

export default async function saveLocationName(
  newData: LocationNameFormData
): Promise<SaveLocationNameResponse> {
  const hotspot = await Prisma.hotspot.findUnique({
    where: { name: newData.name },
    include: { network_configs: true },
  });

  if (!hotspot) {
    return { success: false, error: "Hotspot not found" };
  }

  if (newData.locationName && newData.locationName.trim() !== "") {
    await Prisma.hotspot.update({
      where: { id: hotspot.id },
      data: { location_name: newData.locationName },
    });
  }
  return { success: true };
}
