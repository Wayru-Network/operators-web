import { Button } from "@heroui/button";
import { PortalConfig } from "./customize-captive-portal";
import { CustomInput } from "@/lib/components/custom-input";
import { addToast } from "@heroui/toast";
import { Hotspot } from "@/app/[lang]/(operator)/hotspots/_services/get-hotspots";
import UpdateAssignedHotspot from "./customize-hotspot-dropdown";
import updatePortal from "../_services/update-portal-service";
import { redirect } from "next/navigation";
import { useState } from "react";
import cleanPortalCache from "../_services/clean-portal-cache";

interface PublishProps {
  selectedHandler: (step: string) => void;
  portalConfig: PortalConfig;
  nameHandler: (name: string) => void;
  assignedHotspotHandler: (hotspot: Hotspot[]) => void;
  hotspots: Hotspot[];
  originalConfig: PortalConfig;
}

export default function UpdatePortal({
  selectedHandler,
  portalConfig,
  nameHandler,
  assignedHotspotHandler,
  hotspots,
  originalConfig,
}: PublishProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const handlePublish = async () => {
    setIsUpdating(true);
    const result = await updatePortal(portalConfig, originalConfig);
    if (!result.success) {
      addToast({
        title: "Error",
        description: result.error || "Failed to upload portal configuration",
        color: "danger",
      });
      setIsUpdating(false);
      return;
    }
    if (!result.success && result.error === "No changes detected") {
      addToast({
        title: "No changes detected",
        description: "No changes were made to the portal configuration.",
        color: "warning",
      });
      setIsUpdating(false);
      return;
    }
    const cleanup = await cleanPortalCache(portalConfig.assignedHotspot);
    if (!cleanup.success) {
      addToast({
        title: "Warning",
        description: cleanup.error || "Could not clean portal cache",
        color: "warning",
      });
    }
    addToast({
      title: "Success",
      description: "Portal configuration updated successfully",
      color: "success",
    });
    redirect("/captive-portal");
  };

  // const handleTest = () => {
  //   addToast({
  //     title: "Test Mode",
  //     description: "This feature is not yet implemented.",
  //     color: "danger",
  //   });
  // };

  return (
    <div className="flex flex-col justify-start bg-[#ffffff] dark:bg-[#191c1d] rounded-[30px] p-8 space-y-4">
      <p className="font-bold text-lg">Step 4: Publish</p>
      <p className="font-semibold text-lg">Portal Name</p>
      <CustomInput
        label="Name your portal"
        placeholder="Enter portal name"
        value={portalConfig.portalName}
        onChange={(e) => nameHandler(e.target.value)}
      />
      <p className="font-semibold text-lg">Assign a Hotspot</p>
      <UpdateAssignedHotspot
        selected={portalConfig.assignedHotspot}
        setSelected={assignedHotspotHandler}
        hotspots={hotspots}
      />
      <div className="flex flex-col gap-4 mt-5">
        <Button
          className="w-full text-white bg-black rounded-[10px]"
          onPress={handlePublish}
          isLoading={isUpdating}
        >
          {portalConfig.assignedHotspot.length > 0
            ? `Update and publish to ${portalConfig.assignedHotspot.length} assigned hotspot(s)`
            : "Update portal without assigning hotspots"}
        </Button>
        <div className="flex flex-row gap-2">
          <Button
            className="w-full text-white dark:text-black rounded-[10px]"
            onPress={() => selectedHandler("step3")}
          >
            Go back
          </Button>
          {/* <Button
            className="w-full text-white dark:text-black rounded-[10px]"
            onPress={handleTest}
          >
            Save for later
          </Button> */}
        </div>
      </div>
    </div>
  );
}
