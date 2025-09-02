import { Prisma } from "@/lib/infra/prisma";
import { PrismaClient } from "@prisma/client/extension";
import { uploadImageToBlobStorage } from "../_actions/upload-blob";

export async function uploadAsset(
  file: File,
  label: string,
  tx?: PrismaClient
) {
  const result = await uploadImageToBlobStorage(file);
  if (!result.success || !result.path) {
    return {
      success: false,
      error: result.error || `Failed to upload ${label}`,
    };
  }

  const client = tx ?? Prisma;
  const asset = await client.asset.create({
    data: { asset_url: result.path },
  });

  return { success: true, asset };
}
