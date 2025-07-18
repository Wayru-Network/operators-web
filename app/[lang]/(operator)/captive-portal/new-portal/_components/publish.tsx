import { Button } from "@heroui/button";
import { NewPortalConfig } from "./create-captive-portal";
import { CustomInput } from "@/lib/components/custom-input";
import AssignHotspot from "./assign-hotspot-dropdown";
import uploadConfig from "../_services/upload_config";
import { addToast } from "@heroui/toast";
import { Hotspot } from "../../../hotspots/_services/get-hotspots";
import { redirect } from "next/navigation";

interface PublishProps {
  selectedHandler: (step: string) => void;
  portalConfig: NewPortalConfig;
  nameHandler: (name: string) => void;
  assignedHotspotHandler: (hotspot: string[]) => void;
  hotspots: Hotspot[];
}

export default function Publish({
  selectedHandler,
  portalConfig,
  nameHandler,
  assignedHotspotHandler,
  hotspots,
}: PublishProps) {
  const handlePublish = async () => {
    const result = await uploadConfig(portalConfig);
    if (!result.success) {
      addToast({
        title: "Error",
        description: result.error || "Failed to upload portal configuration",
        color: "danger",
      });
      return;
    }
    addToast({
      title: "Success",
      description: "Portal configuration uploaded successfully",
      color: "success",
    });
    redirect("/captive-portal");
  };

  const handleTest = () => {
    addToast({
      title: "Test Mode",
      description: "This feature is not yet implemented.",
      color: "danger",
    });
  };

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
      <AssignHotspot
        selected={portalConfig.assignedHotspot}
        setSelected={assignedHotspotHandler}
        hotspots={hotspots}
      />
      <div className="flex flex-col gap-4 mt-5">
        <Button
          className="w-full text-white bg-black rounded-[10px]"
          onPress={handlePublish}
        >
          {portalConfig.assignedHotspot.length > 0
            ? `Save and publish to ${portalConfig.assignedHotspot.length} assigned hotspot(s)`
            : "Save new portal without assigning hotspots"}
        </Button>
        <div className="flex flex-row gap-2">
          <Button
            className="w-full text-white dark:text-black rounded-[10px]"
            onPress={() => selectedHandler("step3")}
          >
            Go back
          </Button>
          <Button
            className="w-full text-white dark:text-black rounded-[10px]"
            onPress={handleTest}
          >
            Save for later
          </Button>
        </div>
      </div>
    </div>
  );
}
