import { uploadAsset } from "./upload-assets";
import { adFormat } from "@/lib/generated/prisma";
import { NewPortalConfig } from "../_components/create-captive-portal";
import { PrismaClient } from "@prisma/client/extension";

export async function insertAdConfig(
  config: NewPortalConfig,
  portalId: number,
  tx: PrismaClient
) {
  if (!config.adAsset || !config.adAsset.file) {
    return { success: false, error: "Ad asset file is required" };
  }
  const result = await uploadAsset(config.adAsset.file, "ad", tx);
  if (!result.success) return result;

  const interaction_time = parseInt(config.interactionTime) || 15;

  if (!Object.values(adFormat).includes(config.adFormat as adFormat)) {
    return { success: false, error: "Invalid ad format" };
  }

  await tx.ad.create({
    data: {
      ad_asset_id: result.asset?.id,
      portal_config_id: portalId,
      format: config.adFormat as adFormat,
      interaction_time,
    },
  });

  return { success: true };
}
