import { Metadata } from "next";
import NewPortal from "./_components/new-portal";
import getCaptivePortals from "./_services/get-captive-portals";

export const metadata: Metadata = {
  title: "Captive portal - Wayru",
};

export default async function CaptivePortal() {
  const portals = await getCaptivePortals();

  return (
    <div>
      <h1 className="text-2xl font-normal">Captive portal</h1>
      <NewPortal />
      {portals.map((portal) => (
        <div key={portal.id}>
          <h2>{portal.name}</h2>
          <p>{portal.description}</p>
        </div>
      ))}
    </div>
  );
}
