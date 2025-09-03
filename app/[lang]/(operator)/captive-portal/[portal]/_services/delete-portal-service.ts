"use server";

import { Prisma } from "@/lib/infra/prisma";
import { deleteAssetsService } from "./delete-assets-service";

export default async function deletePortal(portalId: number) {
  try {
    // get portal_config
    const portalConfig = await Prisma.portal_config.findUnique({
      where: {
        id: portalId,
      },
      include: {
        ads: {
          include: {
            asset: {
              select: {
                id: true,
                asset_url: true,
              },
            },
          },
        },
      },
    });

    if (!portalConfig) {
      return {
        success: false,
        error: "Portal config not found",
      };
    }

    // update the relation between portal_config and hotspots
    await Prisma.hotspot.updateMany({
      where: {
        portal_config_id: portalId,
      },
      data: {
        portal_config_id: null,
      },
    });

    // delete the portal_config
    await Prisma.portal_config.delete({
      where: {
        id: portalId,
      },
    });

    if (portalConfig.ads.length > 0) {
      const deleteResult = await deleteAssetsService(
        portalConfig.logo_asset_id,
        portalConfig.banner_asset_id,
        portalConfig.ads
      );
      if (deleteResult.success === false) {
        return {
          success: false,
          error: deleteResult.error || "Failed to delete assets",
        };
      }
    } else {
      // Handle case where there are no ads
      const deleteResult = await deleteAssetsService(
        portalConfig.logo_asset_id,
        portalConfig.banner_asset_id
      );
      if (deleteResult.success === false) {
        return {
          success: false,
          error: deleteResult.error || "Failed to delete assets",
        };
      }
    }

    return {
      success: true,
      message: "Portal deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting portal:", error);
    // rollback the transaction
    return {
      success: false,
      error: "Failed to delete portal",
    };
  }
}
