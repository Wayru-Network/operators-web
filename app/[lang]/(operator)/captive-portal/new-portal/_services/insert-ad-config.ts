import { uploadAsset } from "./upload-assets";
import { adFormat } from "@/lib/generated/prisma";
import { NewPortalConfig } from "../_components/create-captive-portal";
import { PrismaClient } from "@prisma/client/extension";
import { getSession } from "@/lib/session/session";

export async function insertAdConfig(
  config: NewPortalConfig,
  portalId: number,
  tx: PrismaClient
) {
  const session = await getSession();
  if (!session?.userId) {
    return { success: false, error: "User session not found" };
  }

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
      customer_uuid: session.userId,
    },
  });

  return { success: true };
}
