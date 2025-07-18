export interface HotspotNetworksProps {
  locationName: string;
  ssidOpen: string;
  ssidPrivate: string;
  ssidPrivatePassword: string;
}

export default function HotspotNetworks({}: HotspotNetworksProps) {
  return (
    <div>
      <p className="text-lg font-semibold">Network Information</p>
      <div className="mt-4">
        <p>SSID: MyHotspot</p>
        <p>IP Address: 192.168.1.1</p>
        <p>Connected Clients: 10</p>
      </div>
    </div>
  );
}
