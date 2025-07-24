import { PortalConfig } from "../_components/customize-captive-portal";

export interface validateAssetsResult {
  banner_asset?: {
    asset_url: string;
    file: File | null;
  };
  logo_asset?: {
    asset_url: string;
    file: File | null;
  };
  ad_asset?: {
    asset_url: string;
    file: File | null;
  };
  ad_format?: string;
  interaction_time?: string;
}

export default function validateAssets(
  newConfig: PortalConfig,
  previousConfig: PortalConfig
) {
  const updates: validateAssetsResult = {};

  const bannerAssetUrl = previousConfig.banner.name?.split("/")[1] || null;
  const logoAssetUrl = previousConfig.logo.name?.split("/")[1] || null;
  const adAssetUrl = previousConfig.adAsset?.name?.split("/")[1] || null;

  if (
    bannerAssetUrl &&
    newConfig.banner.file?.name &&
    newConfig.banner.file.name !== bannerAssetUrl
  ) {
    updates.banner_asset = {
      asset_url: newConfig.banner.file.name,
      file: newConfig.banner.file,
    };
  }

  if (
    logoAssetUrl &&
    newConfig.logo.file?.name &&
    newConfig.logo.file.name !== logoAssetUrl
  ) {
    updates.logo_asset = {
      asset_url: newConfig.logo.file.name,
      file: newConfig.logo.file,
    };
  }
  if (
    adAssetUrl &&
    newConfig.adAsset?.file?.name &&
    newConfig.adAsset.file.name !== adAssetUrl
  ) {
    updates.ad_asset = {
      asset_url: newConfig.adAsset.file.name,
      file: newConfig.adAsset.file,
    };
  }

  if (newConfig.adFormat !== previousConfig.adFormat) {
    updates.ad_format = newConfig.adFormat;
  }

  if (newConfig.interactionTime !== previousConfig.interactionTime) {
    updates.interaction_time = newConfig.interactionTime;
  }

  return updates;
}
