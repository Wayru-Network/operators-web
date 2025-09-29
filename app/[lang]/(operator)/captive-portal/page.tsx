import { Metadata } from "next";
import PortalsTable from "./_components/portals-table";
import { canCreatePortal } from "./new-portal/_services/can-create-portal";

export const metadata: Metadata = {
  title: "Captive portal - Wayru",
};

export default async function CaptivePortal() {
  const canCreate = await canCreatePortal();
  return (
    <div>
      <h1 className="text-2xl font-normal pb-4">Captive portal</h1>
      <PortalsTable canCreate={canCreate} />
    </div>
  );
}
