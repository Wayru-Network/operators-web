"use server";

import getDeviceBrief from "@/lib/device/get-device-brief";
import getNFNodeByName from "@/lib/nfnode/get-nfnode-by-name";
import { Prisma } from "@/lib/infra/prisma";
import parseHotspotConfig, {
  HotspotOpenNetwork,
  HotspotPrivateNetwork,
} from "./parse-hotspot-config";

export async function getHotspotDetail(name: string): Promise<HotspotDetail> {
  const hotspot = await Prisma.hotspot.findUnique({
    where: { name },
    include: {
      network_configs: true,
    },
  });

  if (!hotspot) {
    throw new Error(`Hotspot ${name} not found`);
  }

  let openNetwork: HotspotOpenNetwork = {
    ssid: "",
  };
  let privateNetwork: HotspotPrivateNetwork = {
    ssid: "",
    password: "",
  };
  if (hotspot.network_configs) {
    const hotspotConfig = parseHotspotConfig(hotspot.network_configs);
    openNetwork = hotspotConfig.openNetwork;
    privateNetwork = hotspotConfig.privateNetwork;
  }

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
        openNetwork: openNetwork,
        privateNetwork: privateNetwork,
      },
      ownership: {
        nftID: nfnode?.solana_asset_id || "",
        ownerAddress: nfnode?.wallet || "",
        macAddress: device?.mac || nfnode?.mac || "",
      },
    },
    networks: {
      locationName: "",
      osServicesVersion: device?.os_services_version || "",
      openNetwork: openNetwork,
      privateNetwork: privateNetwork,
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
      openNetwork: HotspotOpenNetwork;
      privateNetwork: HotspotPrivateNetwork;
    };
    ownership: {
      nftID: string;
      ownerAddress: string;
      macAddress: string;
    };
  };
  networks: {
    locationName: string;
    osServicesVersion: string;
    openNetwork: HotspotOpenNetwork;
    privateNetwork: HotspotPrivateNetwork;
  };
}
