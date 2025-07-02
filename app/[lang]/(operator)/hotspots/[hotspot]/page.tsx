import Image from "next/image";
import HotspotTabs from "../_components/hotspot-tabs";

export default async function HotspotPage({
  params,
}: {
  params: Promise<{ hotspot: string }>;
}) {
  const { hotspot } = await params;
  return (
    <div className="flex flex-col space-y-4">
      <a className="rounded-full bg-secondary w-fit">
        <Image
          src="/assets/arrow-back.svg"
          alt="Back arrow"
          width={43}
          height={43}
          className="hover:cursor-pointer"
        />
      </a>
      <p className="text-2xl pb-4">{hotspot}</p>
      <HotspotTabs hotspot={hotspot} />
    </div>
  );
}
