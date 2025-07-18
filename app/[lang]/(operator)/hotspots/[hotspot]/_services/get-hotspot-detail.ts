"use server";

// import { hotspot } from "@/lib/generated/prisma";
// import { Prisma } from "@/lib/prisma-client/prisma";

export async function getHotspotDetail(id: string): Promise<HotspotDetail> {
  console.log("id", id);
  return detailPlaceholder;
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
      passwordPrivate: string;
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

const detailPlaceholder: HotspotDetail = {
  info: {
    basic: {
      name: "Downtown Wayru Hotspot",
      locationName: "Downtown Coffee Shop",
      model: "WR-3000",
      brand: "Wayru",
      osName: "WayruOS",
      osVersion: "2.1.4",
      osServicesVersion: "1.8.2",
      publicIP: "203.0.113.45",
    },
    network: {
      mac: "00:1A:2B:3C:4D:5E",
      ip: "192.168.1.1",
      serial: "WR3000-ABC123",
      ssidOpen: "Wayru_Public",
      ssidPrivate: "Wayru_Private_001",
      passwordPrivate: "SecurePass123!",
    },
    ownership: {
      nftID: "NFT-12345",
      ownerAddress: "0x742d35Cc6634C0532925a3b8D6Ac73d6e5f9f5e",
      macAddress: "00:1A:2B:3C:4D:5E",
    },
  },
  networks: {
    locationName: "Downtown Coffee Shop",
    ssidOpen: "Wayru_Public",
    ssidPrivate: "Wayru_Private_001",
    ssidPrivatePassword: "SecurePass123!",
  },
};
