import HotspotsTable from "@/app/[lang]/(operator)/hotspots/_components/hotspots-table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hotspots - Wayru",
};

export default function Hotspots() {
  return (
    <div>
      <h1 className="text-2xl font-normal pb-5">My Hotspots</h1>
      <HotspotsTable key={"hotspots-table"} />
    </div>
  );
}
