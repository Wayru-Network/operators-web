import CreateCaptivePortal from "./_components/create-captive-portal";
import { getAllHotspots } from "../../hotspots/_services/get-hotspots";
import { canCreatePortal } from "./_services/can-create-portal";
import { redirect } from "next/navigation";
import { getSubscriptionStatus } from "@/lib/services/subscription-service";

export default async function CaptivePortal() {
  //Prevent access if user has no valid subscription and already has 1 portal
  const canCreate = await canCreatePortal();
  if (!canCreate.able) {
    redirect("/captive-portal");
  }

  // check if the user has a valid subscription
  const validSub = await getSubscriptionStatus();
  // Fetch portals data from the server
  const hotspots = await getAllHotspots();
  // const hotspots = await getHotspotsToAssignCaptivePortal();
  return <CreateCaptivePortal hotspots={hotspots} subStatus={validSub} />;
}
