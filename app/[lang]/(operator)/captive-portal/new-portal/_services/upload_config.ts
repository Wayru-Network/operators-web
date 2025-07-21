"use server";

import { uploadImageToBlobStorage } from "../_actions/upload_blob";
import { NewPortalConfig } from "../_components/create-captive-portal";
import { adFormat } from "@/lib/generated/prisma";
import { Prisma } from "@/lib/infra/prisma";
import { getSession } from "@/lib/session/session";

export default async function uploadConfig(portalConfig: NewPortalConfig) {
  // Validate user session.
  // Must have a valid session with userId.
  const session = await getSession();
  if (!session || !session.userId) {
    return {
      success: false,
      error: "User session not found",
    };
  }

  // Validate logo file
  if (!portalConfig.logo.file) {
    return {
      success: false,
      error: "No logo set",
    };
  }

  // Validate banner file
  if (!portalConfig.banner.file) {
    return {
      success: false,
      error: "No banner set",
    };
  }

  // Upload logo and banner images to blob storage
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

  // Validate logo path
  if (!logoResult.path) {
    return {
      success: false,
      error: "Logo upload did not return a valid path",
    };
  }

  // Create Logo asset in the database
  const logoAsset = await Prisma.asset.create({
    data: {
      asset_url: logoResult.path,
    },
  });

  // Validate banner path
  if (!bannerResult.path) {
    return {
      success: false,
      error: "Banner upload did not return a valid path",
    };
  }

  // Create Banner asset in the database
  const bannerAsset = await Prisma.asset.create({
    data: {
      asset_url: bannerResult.path,
    },
  });

  let createdPortalConfig;

  // Create portal configuration in the database
  try {
    createdPortalConfig = await Prisma.portal_config.create({
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

  if (portalConfig.ad && portalConfig.adAsset?.file) {
    const adResult = await uploadImageToBlobStorage(portalConfig.adAsset.file);
    if (!adResult.success) {
      return {
        success: false,
        error: adResult.error || "Failed to upload ad",
      };
    }

    if (!adResult.path) {
      return {
        success: false,
        error: "Ad upload did not return a valid path",
      };
    }

    // Create Ad asset in the database
    const adAsset = await Prisma.asset.create({
      data: {
        asset_url: adResult.path,
      },
    });

    let interaction_time: number;

    switch (portalConfig.interactionTime) {
      case "15s":
        interaction_time = 15;
        break;
      case "30s":
        interaction_time = 30;
        break;
      case "60s":
        interaction_time = 60;
        break;
      default:
        interaction_time = 15;
    }

    const validAdFormats = Object.values(adFormat);
    if (!validAdFormats.includes(portalConfig.adFormat as adFormat)) {
      return {
        success: false,
        error: "Invalid ad format",
      };
    }

    // Create Ad configuration in the database
    await Prisma.ad.create({
      data: {
        ad_asset_id: adAsset.id,
        portal_config_id: createdPortalConfig.id,
        format: portalConfig.adFormat as adFormat,
        interaction_time: interaction_time,
      },
    });
  }

  // Create hotspot & portal association
  if (portalConfig.assignedHotspot.length > 0) {
    try {
      await Promise.all(
        portalConfig.assignedHotspot.map((hotspot) => {
          return Prisma.hotspot.upsert({
            where: {
              id: parseInt(hotspot),
            },
            update: {
              portal_configs: {
                connect: {
                  id: createdPortalConfig.id,
                },
              },
            },
            create: {
              wayru_device_id: hotspot, // Ensure this property exists in portalConfig
              portal_configs: {
                connect: {
                  id: createdPortalConfig.id,
                },
              },
            },
          });
        })
      );
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to associate hotspot with portal config",
      };
    }
  }

  return {
    success: true,
  };
}
