import CreateCaptivePortal from "./_components/create-captive-portal";
import { getHotspotsToAssign } from "../../hotspots/_services/get-hotspots";

export default async function CaptivePortal() {
  // Fetch portals data from the server
  const hotspots = await getHotspotsToAssign();
  return <CreateCaptivePortal hotspots={hotspots} />;
}
