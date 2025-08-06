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

  const networkInfoText = `Mac address: ${network.mac}
    IP address: ${network.ip ? network.ip : "192.168.45.1"}
    Serial number: ${network.serial || "N/A"}
    SSID open network: ${network.openNetwork.ssid || "N/A"}
    SSID private network: ${network.privateNetwork.ssid || "N/A"}
    Current password: ${network.privateNetwork.password || "N/A"}`;

  const ownershipInfoText = `NFT ID: ${ownership.nftID}
    Owner address: ${ownership.ownerAddress}
    MAC address: ${ownership.macAddress}`;

  const networkDetails = [
    {
      label: "Mac address",
      value: network.mac,
    },
    {
      label: "IP address",
      value: network.ip ? network.ip : "192.168.45.1",
    },
    {
      label: "Serial number",
      value: network.serial || "N/A",
    },
    {
      label: "SSID open network",
      value: network.openNetwork.ssid || "N/A",
    },
    {
      label: "SSID private network",
      value: network.privateNetwork.ssid || "N/A",
    },
    {
      label: "Current password",
      value: network.privateNetwork.password || "N/A",
    },
  ];

  const ownershipDetails = [
    {
      label: "NFT ID",
      value: ownership.nftID,
    },
    {
      label: "Owner address",
      value: ownership.ownerAddress,
    },
    {
      label: "MAC address",
      value: ownership.macAddress,
    },
  ];

  const formatValue = (value: string) => {
    if (value.length > 15) {
      return value.slice(0, 5) + "..." + value.slice(-5);
    }
    return value;
  };

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
                className="rounded-full px-1 py-2 flex items-center justify-center h-[40px] w-[40px] dark:border-gray-600 border-gray-300 border-1"
                codeString={basicInfoText}
                hideSymbol={true}
                classNames={{
                  copyButton: "mr-1",
                }}
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
          <div className="mt-4">
            <div className="w-full flex flex-row justify-between space-x-24">
              <div className="bg-[#F8FAFA] dark:bg-[#222222] py-[21px] px-[19px] rounded-[10px] relative flex flex-row justify-between">
                <div className="min-w-md">
                  {networkDetails.map((detail) => (
                    <div
                      key={detail.label}
                      className="flex flex-row items-center space-x-2"
                    >
                      <p className="text-sm font-bold">{detail.label}:</p>
                      <p>{detail.value || "N/A"}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-row items-end">
                  <Snippet
                    variant="bordered"
                    className="rounded-full px-1 py-2 flex items-center justify-center h-[40px] w-[40px] dark:border-gray-600 border-gray-300 border-1"
                    codeString={networkInfoText}
                    hideSymbol={true}
                    classNames={{
                      copyButton: "mr-1",
                    }}
                    content=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Spacer y={8} />

        {/* Ownership */}
        <div>
          <p className="text-lg font-semibold">Ownership</p>
          <div className="mt-4">
            <div className="w-full flex flex-row justify-between space-x-24">
              <div className="bg-[#F8FAFA] dark:bg-[#222222] py-[21px] px-[19px] rounded-[10px] relative flex flex-row justify-between">
                <div className="min-w-md">
                  {ownershipDetails.map((detail) => (
                    <div
                      key={detail.label}
                      className="flex flex-row items-center space-x-2"
                    >
                      <p className="text-sm font-bold">{detail.label}:</p>
                      <p>{formatValue(detail.value || "N/A")}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-row items-end">
                  <Snippet
                    variant="bordered"
                    className="rounded-full px-1 py-2 flex items-center justify-center h-[40px] w-[40px] dark:border-gray-600 border-gray-300 border-1"
                    codeString={ownershipInfoText}
                    hideSymbol={true}
                    classNames={{
                      copyButton: "mr-1",
                    }}
                    content=""
                  />
                </div>
              </div>
            </div>
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
