"use server";

import getNFNodeByName from "@/lib/nfnode/get-nfnode-by-name";

// import { hotspot } from "@/lib/generated/prisma";
// import { Prisma } from "@/lib/prisma-client/prisma";

export async function getHotspotDetail(name: string): Promise<HotspotDetail> {
  const nfnode = await getNFNodeByName(name);
  if (nfnode) {
    console.log(nfnode);
  }

  const detail: HotspotDetail = {
    info: {
      basic: {
        name: name,
        locationName: "",
        model: "",
        brand: "",
        osName: "",
        osVersion: "",
        osServicesVersion: "",
        publicIP: "",
      },
      network: {
        mac: "",
        ip: "",
        serial: nfnode?.serial || "",
        ssidOpen: "",
        ssidPrivate: "",
        ssidPrivatePassword: "",
      },
      ownership: {
        nftID: "",
        ownerAddress: "",
        macAddress: "",
      },
    },
    networks: {
      locationName: "",
      ssidOpen: "",
      ssidPrivate: "",
      ssidPrivatePassword: "",
    },
  };

  return detail;
}

export interface HotspotDetail {
  info: {
    basic: {
      name: string;
      locationName: string;
      model: string;
      brand: string;
      osName: string;
      osVersion: string;
      osServicesVersion: string;
      publicIP: string;
    };
    network: {
      mac: string;
      ip: string;
      serial: string;
      ssidOpen: string;
      ssidPrivate: string;
      ssidPrivatePassword: string;
    };
    ownership: {
      nftID: string;
      ownerAddress: string;
      macAddress: string;
    };
  };
  networks: {
    locationName: string;
    ssidOpen: string;
    ssidPrivate: string;
    ssidPrivatePassword: string;
  };
}
