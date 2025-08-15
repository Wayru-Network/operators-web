import CreateCaptivePortal from "./_components/create-captive-portal";
import { getHotspotsToAssignCaptivePortal } from "../../hotspots/_services/get-hotspots";

export default async function CaptivePortal() {
  // Fetch portals data from the server
  const hotspots = await getHotspotsToAssignCaptivePortal();
  return <CreateCaptivePortal hotspots={hotspots} />;
}
