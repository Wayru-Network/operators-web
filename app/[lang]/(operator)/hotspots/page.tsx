import HotspotsTable from "@/app/[lang]/(operator)/hotspots/_components/hotspots-table";
import { Metadata } from "next";
import { getHotspots } from "./_services/get-hotspots";

export const metadata: Metadata = {
  title: "Hotspots - Wayru",
};

export default async function Hotspots() {
  const hotspots = await getHotspots();
  return (
    <div>
      <h1 className="text-2xl font-normal pb-5">My Hotspots</h1>
      <HotspotsTable key={"hotspots-table"} rows={hotspots} />
    </div>
  );
}
