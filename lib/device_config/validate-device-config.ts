import { DeviceConfig } from "./types";

export function validateDeviceConfig(config: unknown): config is DeviceConfig {
  if (typeof config !== "object") {
    return false;
  }

  if (config === null) {
    return false;
  }

  if (!("device_config" in config)) {
    return false;
  }

  if (typeof config.device_config !== "object") {
    return false;
  }

  return true;
}
