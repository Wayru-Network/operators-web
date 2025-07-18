import { Button } from "@heroui/button";

export interface DeviceInfoProps {
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
}

export default function HotspotDeviceInfo({
  basic,
  network,
  ownership,
}: DeviceInfoProps) {
  return (
    <div>
      <p className="text-lg font-semibold">Device Information</p>
      <div className="mt-4">
        {/* Top */}
        <div className="w-full flex flex-row justify-between space-x-24">
          {/* Basic info */}
          <div>
            <p>Hotspot Name: {basic.name}</p>
            <p>Location Name: {basic.locationName}</p>
            <p>Model: {basic.model}</p>
            <p>Brand: {basic.brand}</p>
            <p>OS Name: {basic.osName}</p>
            <p>OS Version: {basic.osVersion}</p>
            <p>OS Services Version: {basic.osServicesVersion}</p>
            <p>Public IP: {basic.publicIP}</p>
          </div>
          {/* Quick actions */}
          <div>
            <Button
              fullWidth
              // className={`rounded-lg justify-between ${isActive ? "bg-default text-white dark:text-black" : "bg-transparent text-[#2E3132] dark:text-white hover:bg-[#F2F4F4] dark:hover:bg-[#2E3132]"}`}
            >
              Update firmware
            </Button>
          </div>
        </div>
        {/* Network details */}
        <div></div>
        {/* Ownership */}
        <div></div>
        {/* Hotspot groups */}
        <div></div>
        {/* Save changes */}
        <div></div>
        <p>MAC Address: 00:1A:2B:3C:4D:5E</p>
        <p>Status: Online</p>
        <p>Assigned Portal: Main Portal</p>
      </div>
    </div>
  );
}
