"use client";

import { CustomInput } from "@/lib/components/custom-input";
import { Button } from "@heroui/button";
import { Spacer } from "@heroui/spacer";
import { useCallback, useState } from "react";
import saveHotspotNetworks from "../_services/save-hotspot-networks";
import { HotspotNetworksFormData } from "../_types/hotspot-networks";
import { useParams } from "next/navigation";

export interface HotspotNetworksProps {
  locationName?: string;
  openNetwork?: {
    SSID: string;
  };
  privateNetwork?: {
    SSID: string;
    password: string;
  };
}

export default function HotspotNetworks({
  locationName,
  openNetwork,
  privateNetwork,
}: HotspotNetworksProps) {
  const [locName, setLocName] = useState(locationName || "");
  const [openSSID, setOpenSSID] = useState(openNetwork?.SSID || "");
  const [privateSSID, setPrivateSSID] = useState(privateNetwork?.SSID || "");
  const [newPassword, setNewPassword] = useState(
    privateNetwork?.password || "",
  );
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const helperText = `Name your hotspot to identify its location. (e.g., \"Living Room Hotspot\" or \"Office Branch 1\"). This won't change its unique ID or MAC address.`;

  const { name } = useParams<{ name: string }>();
  console.log("name", name);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const formData: HotspotNetworksFormData = {
        locationName: locName,
        openNetwork: {
          ssid: openSSID,
        },
        privateNetwork: {
          ssid: privateSSID,
          password: newPassword,
        },
        name,
      };

      const result = await saveHotspotNetworks(formData);

      if (result.success) {
        console.log("Networks saved successfully");
      } else {
        console.error("Failed to save networks:", result.error);
      }
    } catch (error) {
      console.error("Error saving networks:", error);
    } finally {
      setIsSaving(false);
    }
  }, [locName, openSSID, privateSSID, newPassword, name]);

  return (
    <div>
      <p className="text-lg font-semibold">Location name</p>
      <Spacer y={4} />
      <CustomInput
        label="Rename hotspot"
        placeholder="Pop bar"
        helper={helperText}
        onChange={(e) => setLocName(e.target.value)}
        value={locName}
        type="text"
        wrapperClass="max-w-[470px]"
      />
      <Spacer y={12} />
      <p className="text-lg font-semibold">Network configuration</p>
      <Spacer y={4} />
      <CustomInput
        label="SSID open network"
        placeholder="Open WiFi"
        helper="Up to 34 characters"
        onChange={(e) => setOpenSSID(e.target.value)}
        value={openSSID}
        type="text"
        wrapperClass="max-w-[210px]"
      />
      <Spacer y={8} />
      <div className="flex flex-row space-x-8">
        <CustomInput
          label="SSID private network"
          placeholder="Private WiFi"
          helper="Up to 34 characters"
          onChange={(e) => setPrivateSSID(e.target.value)}
          value={privateSSID}
          type="text"
          wrapperClass="max-w-[210px]"
        />
        <CustomInput
          label="New password"
          placeholder="Password"
          onChange={(e) => setNewPassword(e.target.value)}
          value={newPassword}
          type="password"
          wrapperClass="max-w-[210px]"
        />
        <CustomInput
          label="Confirm password"
          placeholder="Confirm password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
          type="password"
          wrapperClass="max-w-[210px]"
        />
      </div>
      <Button
        className="w-full text-white bg-black rounded-[10px]"
        onPress={handleSave}
        isLoading={isSaving}
      >
        Save changes
      </Button>
    </div>
  );
}
