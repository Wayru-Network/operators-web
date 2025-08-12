import { Hotspot } from "@/app/[lang]/(operator)/hotspots/_services/get-hotspots";
import { Router } from "lucide-react";
import { X } from "lucide-react";

interface Props {
  hotspots: Hotspot[];
  onRemoveHotspot: (id: number) => void;
}
const PlanTable = ({ hotspots, onRemoveHotspot }: Props) => {
  return (
    <div className="flex flex-col w-full mt-2 gap-1 px-1">
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
              onClick={() => onRemoveHotspot(item.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlanTable;
