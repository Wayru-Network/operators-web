"use server";

import { getSession } from "@/lib/session/session";
import { validatePortalConfigInput } from "./validate-inputs";
import { uploadAsset } from "./upload-assets";
import { insertPortalConfig } from "./insert-portal-config";
import { insertAdConfig } from "./insert-ad-config";
import { assignHotspots } from "./assign-hotspots";
import { NewPortalConfig } from "../_components/create-captive-portal";

export default async function uploadConfig(
  portalConfig: NewPortalConfig
): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await getSession();
  if (!session?.userId) {
    return { success: false, error: "User session not found" };
  }

  if (!portalConfig.logo.file || !portalConfig.banner.file) {
    return { success: false, error: "Logo and banner are required" };
  }

  const inputError = validatePortalConfigInput(portalConfig);
  if (inputError) return { success: false, error: inputError };

  const logoAsset = await uploadAsset(portalConfig.logo.file, "logo");
  if (!logoAsset.success || !logoAsset.asset) return logoAsset;

  const bannerAsset = await uploadAsset(portalConfig.banner.file, "banner");
  if (!bannerAsset.success || !bannerAsset.asset) return bannerAsset;

  const portal = await insertPortalConfig(
    portalConfig,
    session.userId,
    logoAsset.asset.id,
    bannerAsset.asset.id
  );
  if (!portal.success || !portal.portal) return portal;

  if (portalConfig.ad && portalConfig.adAsset?.file) {
    const adCreation = await insertAdConfig(portalConfig, portal.portal.id);
    if (!adCreation.success) return adCreation;
  }

  if (portalConfig.assignedHotspot.length > 0) {
    const association = await assignHotspots(
      portalConfig.assignedHotspot,
      portal.portal.id
    );
    if (!association.success) return association;
  }

  return { success: true };
}
