import CustomSnippet from "@/lib/components/custom-snippet";
// import { Button } from "@heroui/button";
import { Snippet } from "@heroui/snippet";
import { Spacer } from "@heroui/spacer";
import {
  HotspotOpenNetwork,
  HotspotPrivateNetwork,
} from "../_services/parse-hotspot-config";

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
    openNetwork: HotspotOpenNetwork;
    privateNetwork: HotspotPrivateNetwork;
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
  const basicInfoText = `Hotspot name: ${basic.name}
Location name: ${basic.locationName}
Model: ${basic.model}
Brand: ${basic.brand}
OS name: ${basic.osName}
OS version: ${basic.osVersion}
OS services version: ${basic.osServicesVersion}
Public IP: ${basic.publicIP}`;

  return (
    <div>
      <p className="text-lg font-semibold">Basic information</p>
      <div className="mt-4">
        {/* Top */}
        <div className="w-full flex flex-row justify-between space-x-24">
          {/* Basic info */}
          <div className="bg-[#F8FAFA] dark:bg-[#222222] py-[21px] px-[19px] rounded-[10px] relative flex flex-row justify-between">
            <div className="min-w-md">
              <div className="flex flex-row items-center space-x-2">
                <p className="text-sm font-bold">Hotspot name:</p>
                <p>{basic.name}</p>
              </div>
              <div className="flex flex-row items-center space-x-2">
                <p className="text-sm font-bold">Location name:</p>
                <p>{basic.locationName}</p>
              </div>
              <div className="flex flex-row items-center space-x-2">
                <p className="text-sm font-bold">Model:</p>
                <p>{basic.model}</p>
              </div>
              <div className="flex flex-row items-center space-x-2">
                <p className="text-sm font-bold">Brand:</p>
                <p>{basic.brand}</p>
              </div>
              <div className="flex flex-row items-center space-x-2">
                <p className="text-sm font-bold">OS name:</p>
                <p>{basic.osName}</p>
              </div>
              <div className="flex flex-row items-center space-x-2">
                <p className="text-sm font-bold">OS version:</p>
                <p>{basic.osVersion}</p>
              </div>
              <div className="flex flex-row items-center space-x-2">
                <p className="text-sm font-bold">OS services version:</p>
                <p>{basic.osServicesVersion}</p>
              </div>
              <div className="flex flex-row items-center space-x-2">
                <p className="text-sm font-bold">Public IP:</p>
                <p>{basic.publicIP}</p>
              </div>
            </div>
            <div className="flex flex-row items-end">
              <Snippet
                variant="bordered"
                codeString={basicInfoText}
                hideSymbol={true}
                content=""
              />
            </div>
          </div>
          {/* Quick actions */}
          {/* <div>
            <Button
              fullWidth
              // className={`rounded-lg justify-between ${isActive ? "bg-default text-white dark:text-black" : "bg-transparent text-[#2E3132] dark:text-white hover:bg-[#F2F4F4] dark:hover:bg-[#2E3132]"}`}
            >
              Update firmware
            </Button>
          </div> */}
        </div>
        <Spacer y={8} />
        {/* Network details */}
        <div>
          <p className="text-lg font-semibold">Network details</p>
          <Spacer y={8} />
          <div className="flex flex-row space-x-8">
            <CustomSnippet label="MAC address" wrapperClass="max-w-[260px]">
              {network.mac}
            </CustomSnippet>
            <CustomSnippet label="IP address" wrapperClass="max-w-[260px]">
              192.168.45.1
            </CustomSnippet>
            <CustomSnippet label="Serial number" wrapperClass="max-w-[260px]">
              {network.serial || "N/A"}
            </CustomSnippet>
          </div>
          <Spacer y={8} />
          <div className="flex flex-row space-x-8">
            <CustomSnippet
              label="SSID open network"
              wrapperClass="max-w-[260px]"
            >
              {network.openNetwork.ssid || "N/A"}
            </CustomSnippet>
            <CustomSnippet
              label="SSID private network"
              wrapperClass="max-w-[260px]"
            >
              {network.privateNetwork.ssid || "N/A"}
            </CustomSnippet>
            <CustomSnippet
              label="Current password"
              wrapperClass="max-w-[260px]"
            >
              {network.privateNetwork.password || "N/A"}
            </CustomSnippet>
          </div>
        </div>
        <Spacer y={8} />
        {/* Ownership */}
        <div>
          <p className="text-lg font-semibold">Ownership</p>
          <Spacer y={8} />
          <div className="flex flex-row space-x-8">
            <CustomSnippet
              label="NFT ID"
              wrapperClass="max-w-[260px]"
              snippetClass="overflow-hidden whitespace-nowrap overflow-ellipsis"
            >
              {ownership.nftID}
            </CustomSnippet>
            <CustomSnippet
              label="Owner address"
              wrapperClass="max-w-[260px]"
              snippetClass="overflow-hidden whitespace-nowrap overflow-ellipsis"
            >
              {ownership.ownerAddress}
            </CustomSnippet>
            <CustomSnippet label="MAC address" wrapperClass="max-w-[260px]">
              {ownership.macAddress}
            </CustomSnippet>
          </div>
        </div>
        {/* Hotspot groups */}
        <div></div>
        {/* Save changes */}
        <div></div>
      </div>
    </div>
  );
}
