"use server";

import { centsToDollars } from "../helpers/numbers";
import { StripeProduct, StripeProductType, StripeSubscription, SubscriptionType } from "../interfaces/stripe";
import { getSession } from "../session/session";
import { stripe } from "./stripe-config";
import Stripe from "stripe";

export async function getCustomerSubscriptions(): Promise<StripeSubscription[]> {
    try {
        const { isLoggedIn, stripeCustomerId } = await getSession();
        if (!isLoggedIn || !stripeCustomerId) {
            return [];
        }

        const subscriptions = await stripe.subscriptions.list({
            customer: stripeCustomerId,
            status: "all",
            expand: [
                "data.default_payment_method",
                "data.latest_invoice.payment_intent.payment_method",
                "data.items.data.price",
            ],
        });

        const subscriptionsWithType = [];
        for (const sub of subscriptions.data) {
            const product_id = sub.items.data[0].price?.product as unknown as string;
            const product = await stripe.products.retrieve(product_id);

            // Get payment method details
            const paymentMethod = sub.default_payment_method as Stripe.PaymentMethod;

            // Get billing details from price
            const price = sub.items.data[0].price as Stripe.Price;

            subscriptionsWithType.push({
                ...sub,
                type: product.metadata.type,
                name: product.name,
                description: product.description,
                payment_method_details: paymentMethod
                    ? {
                        id: paymentMethod.id,
                        type: paymentMethod.type,
                        card: paymentMethod.card
                            ? {
                                brand: paymentMethod.card.brand,
                                last4: paymentMethod.card.last4,
                                exp_month: paymentMethod.card.exp_month,
                                exp_year: paymentMethod.card.exp_year,
                                country: paymentMethod.card.country,
                                funding: paymentMethod.card.funding,
                            }
                            : undefined,
                        billing_details: paymentMethod.billing_details
                            ? {
                                name: paymentMethod.billing_details.name,
                                email: paymentMethod.billing_details.email,
                                phone: paymentMethod.billing_details.phone,
                                address: paymentMethod.billing_details.address,
                            }
                            : undefined,
                    }
                    : undefined,
                billing_details: price
                    ? {
                        interval: price.recurring?.interval,
                        interval_count: price.recurring?.interval_count,
                        amount: centsToDollars(price.unit_amount || 0),
                        currency: price.currency,
                        trial_period_days: price.recurring?.trial_period_days ?? 7,
                        billing_cycle: `${price.recurring?.interval_count || 1} ${price.recurring?.interval || "month"
                            }`,
                    }
                    : undefined,
            });
        }

        return subscriptionsWithType.map((sub) => ({
            subscription_id: sub.id,
            stripe_customer_id: sub.customer as string,
            status: sub.status,
            current_period_start: sub.start_date,
            current_period_end: 0,
            trial_end: sub.trial_end || undefined,
            cancel_at_period_end: sub.cancel_at_period_end || false,
            type: sub.type as SubscriptionType,
            name: sub.name,
            description: sub.description || undefined,
            payment_method: sub.payment_method_details ? {
                id: sub.payment_method_details.id,
                type: sub.payment_method_details.type as string,
                card: sub.payment_method_details.card,
                billing_details: sub.payment_method_details.billing_details,
            } : undefined,
            billing_details: sub.billing_details,
        }));
    } catch (error) {
        console.error('get subscriptions error', error);
        return [];
    }
}

export async function getStripeProducts(): Promise<StripeProduct[]> {
    try {
        const { data } = await stripe.products.list();

        const products: StripeProduct[] = [];
        for (const product of data) {
            const prices = await stripe.prices.list({
                product: product.id,
                active: true,
            });

            const priceDetails = prices.data.map((price) => ({
                id: price.id,
                price: centsToDollars(price.unit_amount || 0),
                currency: price.currency,
                recurring: price.recurring,
                active: price.active,
            }));

            products.push({
                id: product.id,
                name: product.name,
                description: product.description,
                priceDetails: priceDetails,
                type: product.metadata.type as StripeProductType,
            } as StripeProduct);
        }

        return products;
    } catch (error) {
        console.error('get products error', error);
        return [];
    }
}