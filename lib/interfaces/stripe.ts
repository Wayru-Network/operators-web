
export interface StripeSubscription {
    subscription_id: string;
    stripe_customer_id: string;
    status: string;
    current_period_start: number;
    current_period_end: number;
    trial_end: number | undefined;
    cancel_at_period_end: boolean;
    payment_method: {
        id: string;
        type: string;
        card: {
            brand: string;
            last4: string;
            exp_month: number;
            exp_year: number;
            country: string;
            funding: string;
        } | undefined;
        billing_details?: {
            name: string;
            email: string;
            phone: string;
            address: string;
        },
    } | undefined;
    billing_details?: {
        interval: string;
        interval_count: number;
        amount: number;
        currency: string;
        trial_period_days: number;
        billing_cycle: string;
    } | undefined;
}