import { Button } from "@heroui/button";
import { NewPortalConfig } from "../page";
import { CustomInput } from "@/lib/components/custom-input";
import AssignHotspot from "./assign-hotspot-dropdown";

interface PublishProps {
  selectedHandler: (step: string) => void;
  portalConfig: NewPortalConfig;
  nameHandler: (name: string) => void;
  assignedHotspotHandler: (hotspot: string[]) => void;
}

export default function Publish({
  selectedHandler,
  portalConfig,
  nameHandler,
  assignedHotspotHandler,
}: PublishProps) {
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
      />
      <div className="flex flex-col gap-4 mt-5">
        <Button className="w-full text-white bg-black rounded-[10px]">
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
          <Button className="w-full text-white dark:text-black rounded-[10px]">
            Save for later
          </Button>
        </div>
      </div>
    </div>
  );
}
