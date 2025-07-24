import { Wifi } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Wayru",
};

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-normal">Dashboard</h1>
      <div className="w-full h-full bg-[#ffffff] dark:bg-[#191c1d] rounded-[30px] my-2 p-10">
        <p className="text-base font-semibold">General Analytics</p>
        <div className="flex gap-2 mt-8">
          <div className="flex gap-2 items-start justify-between w-1/3 px-12">
            <div className="flex flex-col">
              <p className="text-base font-medium">Hotspots</p>
              <p className="text-4xl font-semibold">24</p>
            </div>
            <Wifi
              width={20}
              height={14.88}
              className="text-[#000000] dark:text-[#ffffff]"
            />
          </div>

          <div className="flex gap-2 items-start justify-between w-1/3 px-12">
            <div className="flex flex-col">
              <p className="text-base font-medium">Data traffic</p>
              <p className="text-4xl font-semibold">0.00 KB</p>
            </div>
            <Wifi
              width={20}
              height={14.88}
              className="text-[#000000] dark:text-[#ffffff]"
            />
          </div>

          <div className="flex gap-2 items-start justify-between w-1/3 px-12">
            <div className="flex flex-col">
              <p className="text-base font-medium">Connections</p>
              <p className="text-4xl font-semibold">24</p>
            </div>
            <Wifi
              width={20}
              height={14.88}
              className="text-[#000000] dark:text-[#ffffff]"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-18 flex-col">
          <p className="text-base font-semibold">Captive portal analytics</p>
          <p className="text-base font-medium">Soon</p>
        </div>
      </div>
    </div>
  );
}