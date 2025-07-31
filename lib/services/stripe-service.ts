"use server";

import { centsToDollars } from "../helpers/numbers";
import { StripeSubscription } from "../interfaces/stripe";
import { getSession } from "../session/session";
import { stripe } from "./stripe-config";
import Stripe from "stripe";

export async function getSubscriptionWithBillingDetails(subscription_id: string): Promise<StripeSubscription | null> {
    try {

        const { userId } = await getSession();
        if (!userId) {
            throw new Error("User not found");
        }

        const subscription = await stripe.subscriptions.retrieve(subscription_id, {
            expand: ['default_payment_method', 'latest_invoice.payment_intent.payment_method', 'items.data.price']
        });

        const paymentMethod = subscription.default_payment_method as Stripe.PaymentMethod;
        const price = subscription.items.data[0].price as Stripe.Price;

        return {
            subscription_id: subscription.id,
            stripe_customer_id: subscription.customer as string,
            status: subscription.status,
            current_period_start: subscription.start_date,
            current_period_end: 0,
            trial_end: subscription.trial_end || undefined,
            cancel_at_period_end: subscription.cancel_at_period_end || false,
            payment_method: paymentMethod ? {
                id: paymentMethod.id,
                type: paymentMethod.type,
                card: paymentMethod.card ? {
                    brand: paymentMethod.card.brand,
                    last4: paymentMethod.card.last4,
                    exp_month: paymentMethod.card.exp_month,
                    exp_year: paymentMethod.card.exp_year,
                    country: paymentMethod.card.country,
                    funding: paymentMethod.card.funding,
                } as unknown as StripeSubscription['payment_method'] : undefined,
                billing_details: paymentMethod.billing_details ? {
                    name: paymentMethod.billing_details.name,
                    email: paymentMethod.billing_details.email,
                    phone: paymentMethod.billing_details.phone,
                    address: paymentMethod.billing_details.address,
                } : undefined,
            } as unknown as StripeSubscription['payment_method'] : undefined,
            billing_details: price ? {
                interval: price.recurring?.interval,
                interval_count: price.recurring?.interval_count,
                amount: centsToDollars(price.unit_amount || 0),
                currency: price.currency,
                trial_period_days: price.recurring?.trial_period_days,
                billing_cycle: `${price.recurring?.interval_count || 1} ${price.recurring?.interval || 'month'}`,
            } as unknown as StripeSubscription['billing_details'] : undefined,
        };
    } catch (error) {
        console.error(error);
        return null;
    }
}