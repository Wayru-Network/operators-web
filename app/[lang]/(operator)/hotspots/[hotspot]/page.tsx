import HotspotTabs from "../_components/hotspot-tabs";
import { ArrowLeft } from "lucide-react";

export default async function HotspotPage({
  params,
}: {
  params: Promise<{ hotspot: string }>;
}) {
  const { hotspot } = await params;
  return (
    <div className="flex flex-col space-y-4">
      <a className="rounded-full bg-secondary w-fit">
        <ArrowLeft className="text-black m-3" />
      </a>
      <p className="text-2xl pb-4">{hotspot}</p>
      <HotspotTabs hotspot={hotspot} />
    </div>
  );
}
