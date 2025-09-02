"use server";
import { deleteImageFromBlobStorage } from "@/lib/blob_storage/delete-blob";
import { Prisma as PrismaType } from "@/lib/generated/prisma";
import { Prisma } from "@/lib/infra/prisma";

type Ads = PrismaType.adGetPayload<{
  include: {
    asset: {
      select: {
        asset_url: true;
        id: true;
      };
    };
  };
}>;

export async function deleteAssetsService(
  logoId: number,
  bannerId: number,
  ads?: Ads[]
) {
  try {
    const logoAsset = await Prisma.asset.findUnique({
      where: {
        id: logoId,
      },
    });

    if (!logoAsset) {
      return {
        success: false,
        error: "Logo asset not found",
      };
    }

    let result = await deleteImageFromBlobStorage(logoAsset.asset_url);
    if (!result.success) {
      return {
        success: false,
        error: "Failed to delete logo asset",
      };
    }

    const bannerAsset = await Prisma.asset.findUnique({
      where: {
        id: bannerId,
      },
    });
    if (!bannerAsset) {
      return {
        success: false,
        error: "Banner asset not found",
      };
    }

    result = await deleteImageFromBlobStorage(bannerAsset.asset_url);
    if (!result.success) {
      return {
        success: false,
        error: "Failed to delete banner asset",
      };
    }

    if (!ads || ads.length === 0) {
      await Prisma.asset.deleteMany({
        where: {
          id: {
            in: [logoId, bannerId],
          },
        },
      });
      return {
        success: true,
      };
    }

    for (const ad of ads) {
      result = await deleteImageFromBlobStorage(ad.asset?.asset_url || "");
      if (!result.success) {
        return {
          success: false,
          error: "Failed to delete ad asset",
        };
      }
    }

    // Once deleted from Azure storage, delete records from the database

    await Prisma.asset.deleteMany({
      where: {
        id: {
          in: [
            logoId,
            bannerId,
            ...(ads.map((ad) => ad.asset?.id).filter(Boolean) as number[]),
          ],
        },
      },
    });

    await Prisma.ad.deleteMany({
      where: {
        id: {
          in: ads.map((ad) => ad.id),
        },
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting assets:", error);
    return {
      success: false,
      error: "Failed to delete assets",
    };
  }
}
