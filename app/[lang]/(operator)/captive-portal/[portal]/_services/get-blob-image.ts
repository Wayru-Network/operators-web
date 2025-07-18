"use server";

import {
  BlobSASPermissions,
  generateBlobSASQueryParameters,
  SASProtocol,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { getSession } from "@/lib/session/session";
import { env } from "@/lib/infra/env";

export async function getBlobImage(blobName: string) {
  const account = env.AZURE_STORAGE_ACCOUNT_NAME;
  const accountKey = env.AZURE_STORAGE_ACCOUNT_KEY;
  const containerName = env.AZURE_CONTAINER_NAME;
  const serviceUrl = `https://${account}.blob.core.windows.net`;

  if (!account || !accountKey || !serviceUrl) {
    throw new Error("Azure Storage credentials are not properly set");
  }

  const credentials = new StorageSharedKeyCredential(account, accountKey);

  const session = await getSession();
  if (!session || !session.userId) {
    return {
      success: false,
      error: "User session not found",
    };
  }

  const now = new Date();
  const startTime = new Date(now.getTime() - 5 * 60 * 1000); // 5 min
  const expiryTime = new Date(now.getTime() + 10 * 60 * 1000); // 10 min

  // Generate SAS token for read access
  const sasToken = generateBlobSASQueryParameters(
    {
      containerName,
      blobName,
      permissions: BlobSASPermissions.parse("r"), // read only
      startsOn: startTime,
      expiresOn: expiryTime,
      protocol: SASProtocol.Https,
    },
    credentials,
  ).toString();

  const blobUrl = `${serviceUrl}/${containerName}/${blobName}?${sasToken}`;
  return {
    success: true,
    url: blobUrl,
  };
}
