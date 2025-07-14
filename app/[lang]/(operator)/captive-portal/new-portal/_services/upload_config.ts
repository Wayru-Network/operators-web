"use server";

import { uploadImageToBlobStorage } from "../_actions/upload_blob";
import { NewPortalConfig } from "../page";
import { PrismaClient } from "@/lib/generated/prisma";
import { getSession } from "@/lib/session/session";

const Prisma = new PrismaClient();

export default async function uploadConfig(portalConfig: NewPortalConfig) {
  const session = await getSession();
  if (!session || !session.userId) {
    return {
      success: false,
      error: "User session not found",
    };
  }

  if (!portalConfig.logo.file) {
    return {
      success: false,
      error: "No logo set",
    };
  }

  if (!portalConfig.banner.file) {
    return {
      success: false,
      error: "No banner set",
    };
  }

  const logoResult = await uploadImageToBlobStorage(portalConfig.logo.file);
  if (!logoResult.success) {
    return {
      success: false,
      error: logoResult.error || "Failed to upload logo",
    };
  }
  const bannerResult = await uploadImageToBlobStorage(portalConfig.banner.file);
  if (!bannerResult.success) {
    return {
      success: false,
      error: bannerResult.error || "Failed to upload banner",
    };
  }

  if (!logoResult.path) {
    return {
      success: false,
      error: "Logo upload did not return a valid path",
    };
  }

  const logoAsset = await Prisma.asset.create({
    data: {
      asset_url: logoResult.path,
    },
  });

  if (!bannerResult.path) {
    return {
      success: false,
      error: "Banner upload did not return a valid path",
    };
  }

  const bannerAsset = await Prisma.asset.create({
    data: {
      asset_url: bannerResult.path,
    },
  });

  try {
    await Prisma.portal_config.create({
      data: {
        user_id: session.userId,
        portal_name: portalConfig.portalName,
        welcome_message: portalConfig.welcomeMessage,
        logo: { connect: { id: logoAsset.id } },
        banner: { connect: { id: bannerAsset.id } },
        redirect_url: portalConfig.redirectUrl || "",
        background_color: portalConfig.colors.background,
        text_color: portalConfig.colors.text,
        button_color: portalConfig.colors.button,
        success_message: portalConfig.successMessage,
        hotspots: {
          connect: portalConfig.assignedHotspot.map((id) => ({
            id: parseInt(id),
          })),
        },
        ad_access: portalConfig.ad,
        voucher_access: portalConfig.voucher,
        form_access: portalConfig.userInfo,
      },
    });
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create portal config",
    };
  }

  return {
    success: true,
  };
}
