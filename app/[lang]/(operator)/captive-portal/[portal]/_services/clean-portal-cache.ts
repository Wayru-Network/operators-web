"use server";

import { Hotspot } from "../../../hotspots/_services/get-hotspots";
import { env } from "@/lib/infra/env";

export default async function cleanPortalCache(
  assignedHotspots: Hotspot[]
): Promise<{ success: boolean; error?: string }> {
  if (!assignedHotspots || assignedHotspots.length === 0) {
    return { success: true };
  }

  const hotspots = assignedHotspots
    .filter((h) => Boolean(h.wayru_device_id))
    .map((h) => ({ wayru_device_id: h.wayru_device_id }));

  console.log("Cleaning portal cache for devices:", hotspots);
  try {
    const cleanupResult = await fetch(`${env.FAS_URL}/update-portal`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.FAS_API_KEY}`,
      },
      body: JSON.stringify({ hotspots }),
      method: "POST",
    });

    if (!cleanupResult.ok) {
      console.error("Failed to clean portal cache:", cleanupResult.statusText);
      return {
        success: false,
        error: `Failed to clean portal cache: ${cleanupResult.statusText}`,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: `Error cleaning portal cache: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }

  return { success: true };
}
