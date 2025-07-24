import { uploadAsset } from "../../new-portal/_services/upload-assets";
import { PortalConfig } from "../_components/customize-captive-portal";
import { validateAssetsResult } from "./validate-assets";
import { Prisma } from "@/lib/infra/prisma";
import { adFormat } from "@/lib/generated/prisma";

export default async function updateAssets(
  updatedConfig: PortalConfig,
  changes: validateAssetsResult
) {
  if (changes.ad_format) {
    try {
      await Prisma.ad.update({
        where: { id: updatedConfig.ads[0].id },
        data: {
          format: changes.ad_format as adFormat,
        },
      });
    } catch (error) {
      console.error("Error updating ad format:", error);
      throw new Error("Failed to update ad format");
    }
  }

  if (changes.interaction_time) {
    try {
      await Prisma.ad.update({
        where: { id: updatedConfig.ads[0].id },
        data: {
          interaction_time: parseInt(changes.interaction_time),
        },
      });
    } catch (error) {
      console.error("Error updating interaction time:", error);
      throw new Error("Failed to update interaction time");
    }
  }

  if (changes.ad_asset && changes.ad_asset.file) {
    const adAsset = await uploadAsset(changes.ad_asset.file, "ad");
    if (!adAsset.success) {
      throw new Error("Failed to upload ad asset");
    }
    try {
      await Prisma.ad.update({
        where: { id: updatedConfig.ads[0].id },
        data: {
          asset: {
            connect: { id: adAsset.asset?.id },
          },
        },
      });
    } catch (error) {
      console.error("Error updating ad asset:", error);
      throw new Error("Failed to update ad asset");
    }
  }

  if (changes.logo_asset && changes.logo_asset.file) {
    const logoAsset = await uploadAsset(changes.logo_asset.file, "logo");
    if (!logoAsset.success) {
      throw new Error("Failed to upload logo asset");
    }
    try {
      await Prisma.portal_config.update({
        where: { id: updatedConfig.id },
        data: {
          logo: {
            connect: { id: logoAsset.asset?.id },
          },
        },
      });
    } catch (error) {
      console.error("Error updating logo asset:", error);
      throw new Error("Failed to update logo asset");
    }
  }

  if (changes.banner_asset && changes.banner_asset.file) {
    const bannerAsset = await uploadAsset(changes.banner_asset.file, "banner");
    if (!bannerAsset.success) {
      throw new Error("Failed to upload banner asset");
    }
    try {
      await Prisma.portal_config.update({
        where: { id: updatedConfig.id },
        data: {
          banner: {
            connect: { id: bannerAsset.asset?.id },
          },
        },
      });
    } catch (error) {
      console.error("Error updating banner asset:", error);
      throw new Error("Failed to update banner asset");
    }
  }
}
