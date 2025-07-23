import { validateDeviceConfig } from "@/lib/device_config/validate-device-config";
import { network_config } from "@/lib/generated/prisma";

export interface HotspotConfig {
  openNetwork: HotspotOpenNetwork;
  privateNetwork: HotspotPrivateNetwork;
}

export interface HotspotOpenNetwork {
  ssid: string;
}

export interface HotspotPrivateNetwork {
  ssid: string;
  password: string;
}

export default function parseHotspotConfig(
  network_configs: network_config[],
): HotspotConfig {
  let openHotspotConfig: HotspotOpenNetwork = {
    ssid: "",
  };
  let privHotspotConfig: HotspotPrivateNetwork = {
    ssid: "",
    password: "",
  };

  // Extract the open network config
  const open = network_configs.find((config) => config.type === "open");
  if (open) {
    if (validateDeviceConfig(open.device_config)) {
      const config = open.device_config.device_config;
      if (config.wireless) {
        const captiveWifiConfig = config.wireless.find(
          (metaConfig) => metaConfig.meta_section === "captive_wifi_2ghz",
        );
        if (captiveWifiConfig) {
          openHotspotConfig = {
            ssid: captiveWifiConfig.ssid,
          };
        }
      }
    }
  }

  // Extract the private network config
  const priv = network_configs.find((config) => config.type === "private");
  if (priv) {
    if (validateDeviceConfig(priv.device_config)) {
      const config = priv.device_config.device_config;
      if (config.wireless) {
        const privateWifiConfig = config.wireless.find(
          (metaConfig) =>
            metaConfig.meta_section === "default_wifi_interface_0",
        );
        if (privateWifiConfig) {
          privHotspotConfig = {
            ssid: privateWifiConfig.ssid,
            password: privateWifiConfig.key,
          };
        }
      }
    }
  }

  return {
    openNetwork: openHotspotConfig || { ssid: "" },
    privateNetwork: privHotspotConfig || { ssid: "", password: "" },
  };
}
