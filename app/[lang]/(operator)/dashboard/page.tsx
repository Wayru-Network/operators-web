import { Metadata } from "next";
import { getHotspots } from "../hotspots/_services/get-hotspots";
import { getHotspotsAnalytics, Period } from "./_services/get-hotspots-analytics";
import AnalyticCard from "./_components/analytic-card";
import PeriodPicker from "@/lib/components/periodPicker";

export const metadata: Metadata = {
  title: "Dashboard - Wayru",
};

type PageProps = {
  searchParams?: Promise<{
    period?: string;
  }>;
};

export default async function Dashboard({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const period = (params.period as Period) || "last";
  
  const hotspots = await getHotspots(1, 2);
  const nasIds = hotspots.data.map((hotspot) => hotspot.mac);
  const hotspotsAnalytics = await getHotspotsAnalytics(nasIds, period);
  
  const totalHotspots = hotspots?.meta?.total ?? 0;
  const connections = hotspotsAnalytics?.connectionsTotal ?? 0;
  const dataTraffic = hotspotsAnalytics?.dataTrafficTotal ?? 0;
  const unit = hotspotsAnalytics?.unit ?? "KB";

  return (
    <div>
      <h1 className="text-2xl font-normal">Dashboard</h1>
      <div className="mt-3 mb-4">
        <PeriodPicker currentPeriod={period} />
      </div>
      <div className="w-full h-full bg-[#ffffff] dark:bg-[#191c1d] rounded-[30px] my-2 p-10">
        <p className="text-base font-semibold">General Analytics</p>
        <div className="flex gap-2 mt-8">
          <AnalyticCard
            title="Hotspots"
            value={totalHotspots.toString()}
          />
          <AnalyticCard
            title="Data traffic"
            value={dataTraffic.toString()}
            unit={unit}
          />
          <AnalyticCard
            title="Connections"
            value={connections.toString()}
          />
        </div>
        <div className="flex gap-2 mt-18 flex-col">
          <p className="text-base font-semibold">Captive portal analytics</p>
          <p className="text-base font-medium">Soon</p>
        </div>
      </div>
    </div>
  );
}
