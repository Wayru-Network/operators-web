export interface DeviceBrief {
  id: string;
  nfnode_id?: number;
  openwisp_device_id?: string;
  mac?: string;
  model?: string;
  brand?: string;
  os_name?: string;
  os_version?: string;
  os_services_version?: string;
  public_ip?: string;
  status?: DeviceStatus;
}

export type DeviceStatus = "ok" | "problem" | "bad" | "unknown";

export interface DeviceConnectivityDto {
  device_ids: string[];
}

export interface DeviceConnectivityStatus {
  deviceId: string;
  status: "online" | "offline";
}

export interface DeviceConnectivityResponse {
  connectivityResults: DeviceConnectivityStatus[];
}
