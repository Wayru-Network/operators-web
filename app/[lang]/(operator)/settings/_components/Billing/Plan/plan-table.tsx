import { Router, UserRound } from "lucide-react";
import { Checkbox } from "@heroui/react";

type Plan = {
  name: string;
  type: "hotspot" | "gateway";
};

const PlanTable = () => {
  const paged: Plan[] = [
    {
      name: "Pop bar mac 44:35:ab:e5:01",
      type: "hotspot",
    },
    {
      name: "Peluqueria mac 44:35:ab:e5:01",
      type: "gateway",
    },
    {
      name: "Tienda barrio mac 44:35:ab:e5:01",
      type: "gateway",
    },
    {
      name: "Bar bohemia mac 44:35:ab:e5:01",
      type: "gateway",
    },
  ];

  return (
    <div className="flex flex-col w-full mt-2 ml-4 gap-1">
      {paged.map((item, index) => (
        <div
          key={index}
          className="flex flex-row items-center gap-2 justify-between h-8"
        >
          <div className="flex flex-row items-center gap-2 col-span-3">
            {item.type === "hotspot" ? (
              <Router className="w-4 h-4" />
            ) : (
              <UserRound className="w-4 h-4" />
            )}
          </div>
          <div className="flex flex-col col-span-6 justify-start w-60">
            <p className="text-sm font-normal text-left break-words whitespace-normal">
              {item.name}
            </p>
          </div>
          <div className="flex flex-row items-center gap-2 col-span-3 justify-end">
            <Checkbox defaultSelected radius="none" size="sm" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlanTable;
