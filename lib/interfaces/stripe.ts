import Stripe from "stripe";

export type SubscriptionType = "hotspots";
export type StripeProductType = "hotspots" | "vpn";

export interface StripeProduct {
    id: string;
    name: string;
    description: string | null;
    priceDetails: {
        id: string;
        price_with_fee: number;
        price_without_fee: number
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
    base_price_with_fee: number
}

export interface CreateSubscriptionInputWithCustomer
    extends CreateSubscriptionInput {
    customer: {
        email: string;
        name?: string;
        customer_uuid?: string;
        stripe_customer_id?: string;
    };
}

interface PaymentMethod {
    id: string;
    type: Stripe.PaymentMethod.Type;
    last4: string | undefined;
    brand: string | undefined;
    exp_month: number | undefined;
    exp_year: number | undefined;
}
interface BillingDetails {
    interval: Stripe.Price.Recurring.Interval;
    price_per_item: number;
    next_payment_date: string;
    days_until_next_billing: number
}

/* interface LatestInvoice {
    invoice_id: string;
    total_payment: string;
    createdAt: number;
    invoice_pdf: string
} */

export interface StripeSubscription {
    subscription_id: string;
    status: Stripe.Subscription.Status;
    type: SubscriptionType;
    name: string;
    description: string | null;
    products_amount: number;
    payment_method?: PaymentMethod;
    billing_details?: BillingDetails;
    trial_period_start: number | null;
    trial_period_end: number | null;
    cancel_at?: number | null
    cancellation_reason?: string | null
    current_period_end?: number | null
}

export type DiscountSummary = {
    unitPriceWithDiscount: number;
    totalPriceWithDiscount: number;
    totalPriceWithoutDiscount: number;
    discountAmount: number;
    percentOff: number;
};