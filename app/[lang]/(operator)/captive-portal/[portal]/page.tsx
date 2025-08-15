import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import getPortal from "./_services/get-portal";
import CustomizeCaptivePortal from "./_components/customize-captive-portal";
import { getHotspotsToAssignCaptivePortal } from "../../hotspots/_services/get-hotspots";

export default async function HotspotPage({
  params,
}: {
  params: Promise<{ portal: string }>;
}) {
  const { portal: portalId } = await params;
  const portal = await getPortal(Number(portalId));
  const hotspots = await getHotspotsToAssignCaptivePortal();
  if (!portal) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-2xl">Portal not found</p>
        <Link href="/captive-portal" className="mt-4">
          Go back to portals
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      <Link
        className="rounded-full bg-secondary w-fit"
        href={`/captive-portal`}
      >
        <ArrowLeft className="text-black m-3" />
      </Link>
      <p className="text-2xl pb-4">
        {portal ? portal.portalName : "Portal not found"}
      </p>
      <CustomizeCaptivePortal hotspots={hotspots} config={portal} />
    </div>
  );
}
