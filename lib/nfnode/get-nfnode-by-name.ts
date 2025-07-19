import { env } from "@/lib/infra/env";
import { NFNode, NFNodeResponse } from "./types";

export default async function getNFNodeByName(
  name: string,
): Promise<NFNode | null> {
  const url =
    `${env.BACKEND_URL}/api/nfnodes?filters[name][$eq]=${name}` +
    "&fields[0]=name" +
    "&fields[1]=wayru_device_id" +
    "&fields[2]=solana_asset_id" +
    "&fields[3]=mac" +
    "&fields[4]=serial" +
    "&fields[5]=model" +
    "&fields[6]=longitude" +
    "&fields[7]=latitude" +
    "&fields[8]=createdAt" +
    "&fields[9]=updatedAt" +
    "&fields[10]=publishedAt" +
    "&fields[11]=wallet" +
    "&fields[12]=nfnode_type" +
    "&fields[13]=nas_id";
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": env.BACKEND_KEY,
    },
  });
  if (!response.ok) {
    return null;
  }

  try {
    const data: NFNodeResponse = await response.json();

    if (!data.data || data.data.length === 0) {
      return null;
    }

    const firstRecord = data.data[0];
    const nfNode: NFNode = {
      id: firstRecord.id,
      ...firstRecord.attributes,
    };

    return nfNode;
  } catch (error) {
    console.log("error fetching NFNode by name", error);
    return null;
  }
}
