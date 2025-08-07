import { Address } from "@stripe/stripe-js";
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
    last_invoice: Stripe.Invoice;
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
            address: Address | null;
        },
    } | undefined;
    billing_details?: {
        interval: Stripe.Price.Recurring.Interval | undefined;
        interval_count: number | undefined;
        amount: number;
        currency: string;
        trial_period_days: number;
        billing_cycle: string;
        next_payment_date: string;
    } | undefined;
    products_amount: number;
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

export interface CreateSubscriptionInput {
    plan_id: string;
    price_id: string;
    quantity: number;
}