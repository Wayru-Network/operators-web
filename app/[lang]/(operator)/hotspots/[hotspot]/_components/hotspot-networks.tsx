"use client";

import { CustomInput } from "@/lib/components/custom-input";
import { Button } from "@heroui/button";
import { Spacer } from "@heroui/spacer";
import { addToast } from "@heroui/toast";
import { useCallback, useState } from "react";
import saveHotspotNetworks from "../_services/save-hotspot-networks";
import { HotspotNetworksFormData } from "../_types/hotspot-networks";
import { useParams } from "next/navigation";
import {
  HotspotOpenNetwork,
  HotspotPrivateNetwork,
} from "../_services/parse-hotspot-config";
import { Alert } from "@heroui/alert";

export interface HotspotNetworksProps {
  locationName?: string;
  osServicesVersion?: string;
  openNetwork: HotspotOpenNetwork;
  privateNetwork: HotspotPrivateNetwork;
}

export default function HotspotNetworks({
  locationName,
  osServicesVersion,
  openNetwork,
  privateNetwork,
}: HotspotNetworksProps) {
  const [locName, setLocName] = useState(locationName || "");
  const [openSSID, setOpenSSID] = useState(openNetwork.ssid || "");
  const [privateSSID, setPrivateSSID] = useState(privateNetwork.ssid || "");
  const [newPassword, setNewPassword] = useState(privateNetwork.password || "");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const helperText = `Name your hotspot to identify its location. (e.g., \"Living Room Hotspot\" or \"Office Branch 1\"). This won't change its unique ID or MAC address.`;

  const { hotspot } = useParams<{ hotspot: string }>();

  const handleSave = useCallback(async () => {
    // Form validation
    if (privateSSID && newPassword !== confirmPassword) {
      addToast({
        title: "Error",
        description: "Password confirmation does not match",
        color: "danger",
      });
      return;
    }

    if (privateSSID && newPassword.length < 8) {
      addToast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        color: "danger",
      });
      return;
    }

    if (openSSID.length > 34) {
      addToast({
        title: "Error",
        description: "Open network SSID must be 34 characters or less",
        color: "danger",
      });
      return;
    }

    if (privateSSID.length > 34) {
      addToast({
        title: "Error",
        description: "Private network SSID must be 34 characters or less",
        color: "danger",
      });
      return;
    }

    if (!openSSID.trim() && !privateSSID.trim()) {
      addToast({
        title: "Error",
        description: "At least one network must be configured",
        color: "danger",
      });
      return;
    }
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
        name: hotspot,
      };

      const result = await saveHotspotNetworks(formData);

      if (result.success) {
        addToast({
          title: "Success",
          description: "Networks saved successfully",
          color: "success",
        });
        setConfirmPassword(""); // Clear confirm password on success
      } else {
        addToast({
          title: "Error",
          description: result.error || "Failed to save networks",
          color: "danger",
        });
      }
    } catch (error) {
      addToast({
        title: "Error",
        description: "An unexpected error occurred while saving networks",
        color: "danger",
      });
      console.error("Error saving networks:", error);
    } finally {
      setIsSaving(false);
    }
  }, [locName, openSSID, privateSSID, newPassword, confirmPassword, hotspot]);

  const minimumVersion = "2.4.0";
  const isMinimumVersion = isMinimumVersionMet(
    osServicesVersion || "0.0.0",
    minimumVersion,
  );

  return (
    <div>
      {isMinimumVersion ? <PreviewFeatureBanner /> : <MinimumVersionBanner />}
      <Spacer y={4} />
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
        disabled={!isMinimumVersion}
      />
      <Spacer y={6} />
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
        disabled={!isMinimumVersion}
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
          disabled={!isMinimumVersion}
        />
        <CustomInput
          label="New password"
          placeholder="Password"
          onChange={(e) => setNewPassword(e.target.value)}
          value={newPassword}
          type="password"
          wrapperClass="max-w-[210px]"
          disabled={!isMinimumVersion}
        />
        <CustomInput
          label="Confirm password"
          placeholder="Confirm password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
          type="password"
          wrapperClass="max-w-[210px]"
          disabled={!isMinimumVersion}
        />
      </div>
      <Spacer y={8} />

      <Button
        className="rounded-[10px] w-[309px]"
        onPress={handleSave}
        isLoading={isSaving}
        isDisabled={!isMinimumVersion}
      >
        Save changes
      </Button>
    </div>
  );
}

function MinimumVersionBanner() {
  return (
    <Alert
      color="danger"
      title={`Your router does not meet the minimum version requirement.`}
    />
  );
}

function PreviewFeatureBanner() {
  return (
    <Alert
      color="primary"
      title={`This is a preview feature. Issues may occur.`}
    />
  );
}

// Check if the current version meets the minimum version requirement
function isMinimumVersionMet(current: string, minimum: string): boolean {
  const currentParts = current.split(".").map(Number);
  const minimumParts = minimum.split(".").map(Number);

  for (let i = 0; i < minimumParts.length; i++) {
    if (currentParts[i] > minimumParts[i]) {
      return true;
    } else if (currentParts[i] < minimumParts[i]) {
      return false;
    }
  }

  return true;
}
