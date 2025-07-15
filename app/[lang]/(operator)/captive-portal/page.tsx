import { Metadata } from "next";
import PortalsTable from "./_components/portals-table";
import getCaptivePortals from "./_services/get-captive-portals";

export const metadata: Metadata = {
  title: "Captive portal - Wayru",
};

export default async function CaptivePortal() {
  // Fetch portals data from the server
  const portals = await getCaptivePortals();
  return (
    <div>
      <h1 className="text-2xl font-normal pb-4">Captive portal</h1>
      <PortalsTable rows={portals} />
    </div>
  );
}
