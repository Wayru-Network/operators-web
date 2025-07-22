import { uploadAsset } from "./upload-assets";
import { Prisma } from "@/lib/infra/prisma";
import { adFormat } from "@/lib/generated/prisma";
import { NewPortalConfig } from "../_components/create-captive-portal";

export async function insertAdConfig(
  config: NewPortalConfig,
  portalId: number
) {
  if (!config.adAsset || !config.adAsset.file) {
    return { success: false, error: "Ad asset file is required" };
  }
  const result = await uploadAsset(config.adAsset.file, "ad");
  if (!result.success) return result;

  const interaction_time = parseInt(config.interactionTime) || 15;

  if (!Object.values(adFormat).includes(config.adFormat as adFormat)) {
    return { success: false, error: "Invalid ad format" };
  }

  await Prisma.ad.create({
    data: {
      ad_asset_id: result.asset?.id,
      portal_config_id: portalId,
      format: config.adFormat as adFormat,
      interaction_time,
    },
  });

  return { success: true };
}
