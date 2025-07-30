import useSWR from "swr";
import { MinersByAddressResponse } from "@/app/[lang]/(operator)/hotspots/_services/get-hotspots";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useHotspots(
  page: number,
  limit: number,
  search: string,
  fallbackData?: MinersByAddressResponse
) {
  const encodedQuery = encodeURIComponent(search.trim());
  const url = search
    ? `/api/hotspots?page=${page}&limit=${limit}&q=${encodedQuery}`
    : `/api/hotspots?page=${page}&limit=${limit}`;

  const { data, error, isLoading } = useSWR<MinersByAddressResponse>(
    url,
    fetcher,
    {
      fallbackData,
      revalidateOnFocus: false,
    }
  );

  return {
    hotspots: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    error,
  };
}
