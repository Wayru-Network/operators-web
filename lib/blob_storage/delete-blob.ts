"use server";

import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { env } from "@/lib/infra/env";

export async function deleteImageFromBlobStorage(path: string) {
  const account = env.AZURE_STORAGE_ACCOUNT_NAME;
  const accountKey = env.AZURE_STORAGE_ACCOUNT_KEY;
  const containerName = env.AZURE_CONTAINER_NAME;

  if (!account || !accountKey || !containerName) {
    throw new Error(
      "Azure Storage account, key, or container name is not defined in environment variables"
    );
  }

  const credentials = new StorageSharedKeyCredential(account, accountKey);
  const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net`,
    credentials
  );

  const containerClient = blobServiceClient.getContainerClient(containerName);

  try {
    const blockBlobClient = containerClient.getBlockBlobClient(path);
    const result = await blockBlobClient.deleteIfExists();

    return {
      success: result.succeeded,
      message: result.succeeded
        ? "Blob deleted successfully"
        : "Blob not found",
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message || "Failed to delete blob",
    };
  }
}
