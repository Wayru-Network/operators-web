import useSWR from "swr";
import { rowCaptivePortal } from "@/app/api/captive-portals/_services/get-captive-portals";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Helper function to get the correct API URL
const getApiUrl = (path: string) => {
    if (typeof window !== 'undefined') {
        return `${window.location.origin}${path}`;
    }
    return path;
};

export function useCaptivePortals() {
    const { data, error, isLoading, mutate } = useSWR<{
        success: boolean;
        captivePortals: rowCaptivePortal[];
    }>(getApiUrl("/api/captive-portals"), fetcher, {
        revalidateOnFocus: false,
    });

    return {
        captivePortals: data?.captivePortals ?? [],
        isLoading,
        error,
        refreshCaptivePortals: mutate,
    };
}
