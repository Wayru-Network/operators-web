"use server";

import { getSession } from "@/lib/session/session";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { env } from "@/lib/infra/env";

export async function uploadImageToBlobStorage(file: File) {
  if (!file) {
    return {
      success: false,
      error: "Invalid file provided",
    };
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const account = env.AZURE_STORAGE_ACCOUNT_NAME;
  const accountKey = env.AZURE_STORAGE_ACCOUNT_KEY;
  const containerName = env.AZURE_CONTAINER_NAME;

  if (!account || !accountKey || !containerName) {
    throw new Error(
      "Azure Storage account, key, or container name is not defined in environment variables",
    );
  }

  const credentials = new StorageSharedKeyCredential(account, accountKey);
  const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net`,
    credentials,
  );

  const containerClient = blobServiceClient.getContainerClient(containerName);
  await containerClient.createIfNotExists();

  const session = await getSession();
  if (!session || !session.userId) {
    return {
      success: false,
      error: "User session not found",
    };
  }

  const blobPath = `${session.userId}/${file.name}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobPath);

  try {
    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: { blobContentType: file.type },
    });
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message || "Failed to upload image to storage",
    };
  }

  return {
    success: true,
    path: blobPath,
  };
}
