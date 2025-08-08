import useSWR from "swr";
import { CustomerSubscription } from "@/lib/interfaces/subscriptions";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Helper function to get the correct API URL
const getApiUrl = (path: string) => {
    if (typeof window !== 'undefined') {
        return `${window.location.origin}${path}`;
    }
    return path;
};

export function useSubscription() {
    const { data, error, isLoading, mutate } = useSWR<{
        success: boolean;
        subscription: CustomerSubscription;
    }>(getApiUrl("/api/subscriptions"), fetcher, {
        revalidateOnFocus: false,
    });

    return {
        subscription: data?.subscription,
        isLoading,
        error,
        refreshSubscriptions: mutate,
    };
}
