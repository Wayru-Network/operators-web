import { Metadata } from "next";
import getCaptivePortals from "./_services/get-captive-portals";
import PortalsTable from "./_components/portals-table";

export const metadata: Metadata = {
  title: "Captive portal - Wayru",
};

export default async function CaptivePortal() {
  const portals = await getCaptivePortals();

  return (
    <div>
      <h1 className="text-2xl font-normal pb-4">Captive portal</h1>
      {portals.map((portal) => (
        <div key={portal.id}>
          <h2>{portal.name}</h2>
          <p>{portal.description}</p>
        </div>
      ))}
      <PortalsTable />
    </div>
  );
}
