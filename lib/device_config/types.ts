export interface DeviceConfig {
  device_config: {
    wireless?: MetaKeys[];
    opennds?: MetaKeys[];
    wayru?: MetaKeys[];
  };
}

export interface MetaKeys {
  meta_config: string;
  meta_type: string;
  meta_section: string;
  [key: string]: string;
}

// Config Fragment DTOs matching the Go backend
export interface CreateConfigFragmentDto {
  device_id?: string;
  group_id?: string;
  type: "device" | "group" | "system";
  name: string;
  fragment: DeviceConfig;
  enabled?: boolean;
  priority?: number;
}

export interface UpdateConfigFragmentDto {
  name: string;
  fragment: DeviceConfig;
  enabled?: boolean;
  priority?: number;
}

export interface ConfigFragmentResponse {
  id: number;
  device_id: string;
  group_id?: string;
  type: string;
  name: string;
  fragment: DeviceConfig;
  enabled: boolean;
  priority: number;
}
