import HotspotsTable from "@/app/[lang]/(operator)/hotspots/_components/hotspots-table";
import { Metadata } from "next";
import { getHotspots } from "./_services/get-hotspots";
import { searchHotspots } from "@/lib/services/search-hotspots";

export const metadata: Metadata = {
  title: "Hotspots - Wayru",
};

type PageProps = {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
    q?: string;
  }>;
};

export default async function Hotspots({ searchParams }: PageProps) {
  const page = Number((await searchParams)?.page ?? "1");
  const limit = Number((await searchParams)?.limit ?? "10");
  const query = (await searchParams)?.q ?? "";

  const hotspots = query
    ? await searchHotspots(query, page, limit)
    : await getHotspots(page, limit);

  return (
    <div>
      <h1 className="text-2xl font-normal pb-4">My Hotspots</h1>
      <HotspotsTable
        key={"hotspots-table"}
        rows={hotspots.data}
        initialMeta={hotspots.meta}
        initialQuery={query}
      />
    </div>
  );
}
