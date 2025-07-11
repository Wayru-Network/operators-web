import { Metadata } from "next";
import PortalsTable from "./_components/portals-table";

export const metadata: Metadata = {
  title: "Captive portal - Wayru",
};

export default async function CaptivePortal() {
  return (
    <div>
      <h1 className="text-2xl font-normal pb-4">Captive portal</h1>
      <PortalsTable />
    </div>
  );
}
