export interface HotspotNetworksFormData {
  locationName: string;
  openNetwork: {
    ssid: string;
  };
  privateNetwork: {
    ssid: string;
    password: string;
  };
  name: string;
}

export interface LocationNameFormData {
  locationName: string;
  name: string;
}

export interface SaveLocationNameResponse {
  success: boolean;
  error?: string;
}

export interface SaveHotspotNetworksResponse {
  success: boolean;
  error?: string;
}
