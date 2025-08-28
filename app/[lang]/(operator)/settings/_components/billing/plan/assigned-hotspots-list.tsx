import { Hotspot } from "@/app/[lang]/(operator)/hotspots/_services/get-hotspots";
import { Router } from "lucide-react";
import { X } from "lucide-react";
import { ScrollShadow } from "@heroui/react";

interface Props {
  hotspots: Hotspot[];
  onRemoveHotspot: (wayruDeviceId: string) => void;
}
const AssignedHotspotsList = ({ hotspots, onRemoveHotspot }: Props) => {
  return (
    <ScrollShadow
      visibility="none"
      className="mt-2 gap-1 px-1 md:w-full lg:w-[400px] md:max-h-[150px] lg:max-h-[390px]"
    >
      {hotspots.map((item, index) => (
        <div
          key={index}
          className="flex flex-row items-center gap-2 justify-between h-9"
        >
          <div className="flex flex-row items-center gap-2 col-span-3">
            <Router className="w-4 h-4" />
          </div>
          <div className="flex flex-col col-span-6 justify-start w-60">
            <p className="text-sm font-normal text-left break-words whitespace-normal">
              {item.name}
            </p>
          </div>
          <div className="flex flex-row items-center gap-2 col-span-3 justify-end">
            <X
              className="cursor-pointer"
              size={16}
              onClick={() => onRemoveHotspot(item.wayru_device_id)}
            />
          </div>
        </div>
      ))}
    </ScrollShadow>
  );
};

export default AssignedHotspotsList;
