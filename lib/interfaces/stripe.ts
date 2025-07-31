import Stripe from "stripe";

export type SubscriptionType = 'hotspots'
export type StripeProductType = 'hotspots' | 'vpn'
export interface StripeSubscription {
    subscription_id: string;
    stripe_customer_id: string;
    status: string;
    current_period_start: number;
    current_period_end: number;
    trial_end: number | undefined;
    cancel_at_period_end: boolean;
    type: SubscriptionType;
    name: string;
    description: string | undefined;
    payment_method: {
        id: string;
        type: string;
        card: {
            brand: string;
            last4: string;
            exp_month: number;
            exp_year: number;
            country: string | null;
            funding: string;
        } | undefined;
        billing_details?: {
            name: string | null;
            email: string | null;
            phone: string | null;
            address: any;
        },
    } | undefined;
    billing_details?: {
        interval: string | undefined;
        interval_count: number | undefined;
        amount: number;
        currency: string;
        trial_period_days: number;
        billing_cycle: string;
    } | undefined;
}


export interface StripeProduct {
    id: string;
    name: string;
    description: string | null;
    priceDetails: {
        id: string;
        price: number;
        currency: string;
        recurring: Stripe.Price.Recurring | null;
        active: boolean;
    }[];
    type: StripeProductType;
}