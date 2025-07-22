import { uploadImageToBlobStorage } from "../_actions/upload_blob";
import { Prisma } from "@/lib/infra/prisma";

export async function uploadAsset(file: File, label: string) {
  const result = await uploadImageToBlobStorage(file);
  if (!result.success || !result.path) {
    return {
      success: false,
      error: result.error || `Failed to upload ${label}`,
    };
  }

  const asset = await Prisma.asset.create({
    data: { asset_url: result.path },
  });

  return { success: true, asset };
}
