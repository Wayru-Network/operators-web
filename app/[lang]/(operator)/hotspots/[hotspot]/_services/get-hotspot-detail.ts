"use server";

import getDeviceBrief from "@/lib/device/get-device-brief";
import getNFNodeByName from "@/lib/nfnode/get-nfnode-by-name";

// import { hotspot } from "@/lib/generated/prisma";
// import { Prisma } from "@/lib/prisma-client/prisma";

export async function getHotspotDetail(name: string): Promise<HotspotDetail> {
  const nfnode = await getNFNodeByName(name);
  let device = null;

  if (nfnode && nfnode.wayru_device_id) {
    device = await getDeviceBrief(nfnode.wayru_device_id);
  }

  const detail: HotspotDetail = {
    info: {
      basic: {
        name: name,
        locationName: "",
        model: device?.model || nfnode?.model || "",
        brand: device?.brand || "",
        osName: device?.os_name || "",
        osVersion: device?.os_version || "",
        osServicesVersion: device?.os_services_version || "",
        publicIP: device?.public_ip || "",
      },
      network: {
        mac: device?.mac || nfnode?.mac || "",
        ip: "",
        serial: nfnode?.serial || "",
        openNetwork: {
          SSID: "",
        },
        privateNetwork: {
          SSID: "",
          password: "",
        },
      },
      ownership: {
        nftID: nfnode?.solana_asset_id || "",
        ownerAddress: nfnode?.wallet || "",
        macAddress: device?.mac || nfnode?.mac || "",
      },
    },
    networks: {
      locationName: "",
      openNetwork: {
        SSID: "",
      },
      privateNetwork: {
        SSID: "",
        password: "",
      },
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
      openNetwork?: {
        SSID: string;
      };
      privateNetwork?: {
        SSID: string;
        password: string;
      };
    };
    ownership: {
      nftID: string;
      ownerAddress: string;
      macAddress: string;
    };
  };
  networks: {
    locationName: string;
    openNetwork?: {
      SSID: string;
    };
    privateNetwork?: {
      SSID: string;
      password: string;
    };
  };
}
