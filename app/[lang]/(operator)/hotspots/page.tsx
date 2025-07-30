import HotspotsTable from "@/app/[lang]/(operator)/hotspots/_components/hotspots-table";
import { Metadata } from "next";
import { getHotspots } from "./_services/get-hotspots";

export const metadata: Metadata = {
  title: "Hotspots - Wayru",
};

type PageProps = {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
  }>;
};

export default async function Hotspots({ searchParams }: PageProps) {
  const page = Number((await searchParams)?.page ?? "1");
  const limit = Number((await searchParams)?.limit ?? "6");
  const hotspots = await getHotspots(page, limit);
  return (
    <div>
      <h1 className="text-2xl font-normal pb-5">My Hotspots</h1>
      <HotspotsTable
        key={"hotspots-table"}
        rows={hotspots.data}
        initialMeta={hotspots.meta}
      />
    </div>
  );
}
