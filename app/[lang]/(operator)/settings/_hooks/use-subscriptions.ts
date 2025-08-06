import useSWR from "swr";
import { StripeSubscription } from "@/lib/interfaces/stripe";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Helper function to get the correct API URL
const getApiUrl = (path: string) => {
    if (typeof window !== 'undefined') {
        return `${window.location.origin}${path}`;
    }
    return path;
};

export function useSubscriptions() {
    const { data, error, isLoading, mutate } = useSWR<{
        success: boolean;
        subscriptions: StripeSubscription[];
    }>(getApiUrl("/api/billing/subscriptions"), fetcher, {
        revalidateOnFocus: false,
    });

    return {
        subscriptions: data?.subscriptions ?? [],
        isLoading,
        error,
        refreshSubscriptions: mutate,
    };
}
