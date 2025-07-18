import CreateCaptivePortal from "./_components/create-captive-portal";
import { getHotspots } from "../../hotspots/_services/get-hotspots";

export default async function CaptivePortal() {
  // Fetch portals data from the server
  const hotspots = await getHotspots();
  return <CreateCaptivePortal hotspots={hotspots} />;
}
