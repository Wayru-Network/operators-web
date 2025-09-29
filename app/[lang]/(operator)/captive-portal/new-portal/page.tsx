import CreateCaptivePortal from "./_components/create-captive-portal";
import { getHotspotsToAssignCaptivePortal } from "../../hotspots/_services/get-hotspots";
import { canCreatePortal } from "./_services/can-create-portal";
import { redirect } from "next/navigation";

export default async function CaptivePortal() {
  //Prevent access if user has no valid subscription and already has 1 portal
  const canCreate = await canCreatePortal();
  if (!canCreate) {
    redirect("/captive-portal");
  }
  // Fetch portals data from the server
  const hotspots = await getHotspotsToAssignCaptivePortal();
  return <CreateCaptivePortal hotspots={hotspots} />;
}
