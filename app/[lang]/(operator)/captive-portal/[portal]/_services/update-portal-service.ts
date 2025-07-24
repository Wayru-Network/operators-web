"use server";
import { PortalConfig } from "../_components/customize-captive-portal";
import { Prisma } from "@/lib/infra/prisma";
import validateChanges from "./validate-changes";
import validateAssets from "./validate-assets";
import updateAssets from "./update-assets";
import validateHotspots from "./validate-hotspots";

export default async function updatePortal(
  updatedConfig: PortalConfig,
  originalConfig: PortalConfig
): Promise<{
  success: boolean;
  error?: string;
}> {
  const updates = validateChanges(updatedConfig, originalConfig);
  const assetsUpdates = validateAssets(updatedConfig, originalConfig);
  const hotspotValidation = await validateHotspots(
    updatedConfig,
    originalConfig
  );

  const assetsChanged = Object.keys(assetsUpdates).length > 0;
  const configChanged = Object.keys(updates).length > 0;

  if (!hotspotValidation.success) {
    return { success: false, error: hotspotValidation.error };
  } else if (!assetsChanged && !configChanged) {
    return { success: true };
  }

  if (assetsChanged) {
    try {
      await updateAssets(updatedConfig, assetsUpdates);
      if (Object.keys(updates).length === 0) {
        return { success: true };
      }
    } catch (error) {
      console.error("Error updating portal assets:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  if (configChanged) {
    try {
      await Prisma.portal_config.update({
        where: { id: updatedConfig.id },
        data: updates,
      });
      return { success: true };
    } catch (error) {
      console.error("Error updating portal:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
  return { success: false, error: "No changes detected" };
}
