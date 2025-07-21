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
  const params = (await searchParams) ?? {};
  if (!params.page) params.page = "1";
  if (!params.limit) params.limit = "6";
  const hotspots = await getHotspots(Number(params.page), Number(params.limit));
  return (
    <div>
      <h1 className="text-2xl font-normal pb-5">My Hotspots</h1>
      <HotspotsTable
        key={"hotspots-table"}
        rows={hotspots.data}
        meta={hotspots.meta}
      />
    </div>
  );
}
