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

export interface SaveHotspotNetworksResponse {
  success: boolean;
  error?: string;
}
