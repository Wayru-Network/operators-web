"use client";

import { CustomInput } from "@/lib/components/custom-input";
import { Button } from "@heroui/button";
import { Spacer } from "@heroui/spacer";
import { addToast } from "@heroui/toast";
import { useCallback, useState } from "react";
import saveHotspotNetworks from "../_services/save-hotspot-networks";
import {
  HotspotNetworksFormData,
  LocationNameFormData,
} from "../_types/hotspot-networks";
import { useParams } from "next/navigation";
import {
  HotspotOpenNetwork,
  HotspotPrivateNetwork,
} from "../_services/parse-hotspot-config";
import { Alert } from "@heroui/alert";
import { useCustomerSubscription } from "@/lib/contexts/customer-subscription-context";
import { CustomerSubscription } from "@/lib/interfaces/subscriptions";
import saveLocationName from "../_services/save-location-name";
import { isMinimumVersionMet } from "@/lib/helpers/operators";

export interface HotspotNetworksProps {
  locationName?: string;
  osServicesVersion?: string;
  openNetwork: HotspotOpenNetwork;
  privateNetwork: HotspotPrivateNetwork;
  onLocationNameChange?: (name: string) => void;
  onOpenSSIDChange?: (ssid: string) => void;
  onPrivateSSIDChange?: (ssid: string) => void;
  onPrivatePasswordChange?: (password: string) => void;
}

export default function HotspotNetworks({
  locationName,
  osServicesVersion,
  openNetwork,
  privateNetwork,
  onLocationNameChange,
  onOpenSSIDChange,
  onPrivateSSIDChange,
  onPrivatePasswordChange,
}: HotspotNetworksProps) {
  const [locName, setLocName] = useState(locationName || "");
  const [openSSID, setOpenSSID] = useState(openNetwork.ssid || "");
  const [newOpenSSID, setNewOpenSSID] = useState<string>("");
  const [privateSSID, setPrivateSSID] = useState(privateNetwork.ssid || "");
  const [newPrivateSSID, setNewPrivateSSID] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingLocation, setIsSavingLocation] = useState(false);
  const helperText = `Name your hotspot to identify its location. (e.g., \"Living Room Hotspot\" or \"Office Branch 1\"). This won't change its unique ID or MAC address.`;

  const { hotspot } = useParams<{ hotspot: string }>();

  const handleSave = useCallback(async () => {
    // Form validation
    if (newPrivateSSID === privateSSID) {
      addToast({
        title: "Warning",
        description: "Private network SSID is unchanged",
        color: "warning",
      });
      return;
    }

    if (newPrivateSSID.trim() && newPassword !== confirmPassword) {
      addToast({
        title: "Error",
        description: "Password confirmation does not match",
        color: "danger",
      });
      return;
    }

    if (newPrivateSSID.trim() && newPassword.length < 8) {
      addToast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        color: "danger",
      });
      return;
    }

    if (newOpenSSID.length > 34) {
      addToast({
        title: "Error",
        description: "Open network SSID must be 34 characters or less",
        color: "danger",
      });
      return;
    }

    if (newOpenSSID === openSSID) {
      addToast({
        title: "Warning",
        description: "Open network SSID is unchanged",
        color: "warning",
      });
      return;
    }

    if (newPrivateSSID.length > 34) {
      addToast({
        title: "Error",
        description: "Private network SSID must be 34 characters or less",
        color: "danger",
      });
      return;
    }

    if (!newOpenSSID.trim() && !newPrivateSSID.trim()) {
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
        locationName: locName === locationName ? "" : locName,
        openNetwork: {
          ssid: newOpenSSID,
        },
        privateNetwork: {
          ssid: newPrivateSSID,
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
        if (newOpenSSID.trim()) {
          setOpenSSID(newOpenSSID);
          onOpenSSIDChange?.(newOpenSSID);
          setNewOpenSSID("");
        }

        if (newPrivateSSID.trim()) {
          setPrivateSSID(newPrivateSSID);
          onPrivateSSIDChange?.(newPrivateSSID);
          onPrivatePasswordChange?.(newPassword);
          setNewPrivateSSID("");
          setNewPassword("");
        }
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
  }, [
    locName,
    locationName,
    openSSID,
    newOpenSSID,
    privateSSID,
    newPrivateSSID,
    newPassword,
    confirmPassword,
    hotspot,
    onOpenSSIDChange,
    onPrivateSSIDChange,
    onPrivatePasswordChange,
  ]);

  const handleLocationSave = useCallback(async () => {
    if (!locName.trim()) {
      addToast({
        title: "Warning",
        description: "Location name cannot be empty",
        color: "warning",
      });
      return;
    }

    if (locName === locationName) {
      addToast({
        title: "Warning",
        description: "Location name is unchanged",
        color: "warning",
      });
      return;
    }

    const formData: LocationNameFormData = {
      locationName: locName,
      name: hotspot,
    };

    setIsSavingLocation(true);

    try {
      const result = await saveLocationName(formData);
      if (result.success) {
        addToast({
          title: "Success",
          description: "Location name updated successfully",
          color: "success",
        });
        onLocationNameChange?.(locName);
      } else {
        addToast({
          title: "Error",
          description: result.error || "Failed to update location name",
          color: "danger",
        });
      }
    } catch (error) {
      console.error("Error updating location name:", error);
      addToast({
        title: "Error",
        description:
          "An unexpected error occurred while updating location name",
        color: "danger",
      });
    } finally {
      setIsSavingLocation(false);
    }
  }, [locName, locationName, hotspot, onLocationNameChange]);

  const { subscription } = useCustomerSubscription();
  const { is_subscription_active } = subscription as CustomerSubscription;

  const isMinimumVersion = isMinimumVersionMet(osServicesVersion || "0.0.0");
  const isDisabled = !isMinimumVersion || !is_subscription_active;

  const RenderBanner = () => {
    switch (true) {
      case !is_subscription_active:
        return <SubscriptionInactiveBanner />;
      case !isMinimumVersion:
        return <MinimumVersionBanner />;
      default:
        return <PreviewFeatureBanner />;
    }
  };

  return (
    <div>
      {RenderBanner()}
      <Spacer y={4} />
      <p className="text-lg font-semibold">Location name</p>
      <Spacer y={4} />
      <CustomInput
        label="Rename hotspot"
        placeholder={locName === "" ? "Pop Bar" : locName}
        helper={helperText}
        onChange={(e) => setLocName(e.target.value)}
        value={locName}
        type="text"
        wrapperClass="max-w-[470px]"
        disabled={isDisabled}
      />
      <Spacer y={6} />
      <Button
        className="rounded-[10px] md:w-full lg:w-[309px]"
        onPress={handleLocationSave}
        isLoading={isSavingLocation}
        isDisabled={isDisabled || isSavingLocation}
      >
        Save changes
      </Button>
      <Spacer y={8} />

      <p className="text-lg font-semibold mt-4">Open Network configuration</p>
      <Spacer y={4} />
      <CustomInput
        label="SSID open network"
        placeholder={openSSID}
        helper="Up to 34 characters"
        onChange={(e) => setNewOpenSSID(e.target.value)}
        value={newOpenSSID}
        type="text"
        wrapperClass="max-w-[210px]"
        disabled={isDisabled}
      />
      <Spacer y={8} />
      <p className="text-lg font-semibold mb-4">
        Private Network configuration
      </p>
      <div className="flex md:flex-col lg:flex-row space-x-8 md:space-y-8 lg:space-y-0">
        <CustomInput
          label="SSID private network"
          placeholder={privateSSID}
          helper="Up to 34 characters"
          onChange={(e) => setNewPrivateSSID(e.target.value)}
          value={newPrivateSSID}
          type="text"
          wrapperClass="lg:max-w-[210px] md:w-full"
          disabled={isDisabled}
        />
        <CustomInput
          label="New password"
          placeholder="Password"
          onChange={(e) => setNewPassword(e.target.value)}
          value={newPassword}
          type="password"
          wrapperClass="lg:max-w-[210px] md:w-full"
          disabled={isDisabled}
        />
        <CustomInput
          label="Confirm password"
          placeholder="Confirm password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
          type="password"
          wrapperClass="lg:max-w-[210px] md:w-full"
          disabled={isDisabled}
        />
      </div>
      <Spacer y={8} />

      <Button
        className="rounded-[10px] md:w-full lg:w-[309px]"
        onPress={handleSave}
        isLoading={isSaving}
        isDisabled={!isMinimumVersion} //This button is available if the customer don't have a subscription active
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

function SubscriptionInactiveBanner() {
  return <Alert color="warning" title={`Your subscription is not activated`} />;
}
