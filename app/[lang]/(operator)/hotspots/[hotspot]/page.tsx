import HotspotTabs from "../_components/hotspot-tabs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getHotspotDetail } from "./_services/get-hotspot-detail";
export default async function HotspotPage({
  params,
}: {
  params: Promise<{ hotspot: string }>;
}) {
  const { hotspot } = await params;
  const hotspotDetail = await getHotspotDetail(hotspot);
  return (
    <div className="flex flex-col space-y-4">
      <Link className="rounded-full bg-secondary w-fit" href={`/hotspots`}>
        <ArrowLeft className="text-black m-3" />
      </Link>
      <p className="text-2xl pb-4">{hotspot}</p>
      <HotspotTabs {...hotspotDetail} />
    </div>
  );
}
