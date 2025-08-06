"use server";

import moment from "moment";
import { centsToDollars } from "../helpers/numbers";
import { Prisma } from "../infra/prisma";
import {
    CreateSubscriptionInput,
    StripeProduct,
    StripeProductType,
    StripeSubscription,
    SubscriptionType,
} from "../interfaces/stripe";
import { getSession, updateSession } from "../session/session";
import { stripeServer } from "./stripe-server-config";
import Stripe from "stripe";

export async function getCustomerSubscriptions(): Promise<
    StripeSubscription[]
> {
    try {
        const { isLoggedIn, stripeCustomerId } = await getSession();
        if (!isLoggedIn || !stripeCustomerId) {
            return [];
        }

        const subscriptions = await stripeServer.subscriptions.list({
            customer: stripeCustomerId,
            status: "all",
            expand: [
                "data.default_payment_method",
                "data.latest_invoice.payment_intent.payment_method",
                "data.items.data.price"
            ],
        });

        const subscriptionsWithType = [];
        for (const sub of subscriptions.data) {
            const product_id = sub.items.data[0].price?.product as unknown as string;
            const products_amount = sub.items.data[0].quantity;
            const product = await stripeServer.products.retrieve(product_id);

            // Get payment method details
            const paymentMethod = sub.default_payment_method as Stripe.PaymentMethod;

            // Get billing details from price
            const price = sub.items.data[0].price as Stripe.Price;

            subscriptionsWithType.push({
                ...sub,
                type: product.metadata.type,
                name: product.name,
                description: product.description,
                products_amount: products_amount,
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
                        next_payment_date: moment(sub.items.data[0].current_period_end * 1000).format("MMM DD, YYYY")
                    }
                    : undefined,
            });
        }

        const subscriptionsMapped = subscriptionsWithType.map((sub) => ({
            subscription_id: sub.id,
            stripe_customer_id: sub.customer as string,
            status: sub.status,
            current_period_start: sub.items.data[0].current_period_start,
            current_period_end: sub.items.data[0].current_period_end,
            trial_end: sub.trial_end || undefined,
            cancel_at_period_end: sub.cancel_at_period_end || false,
            type: sub.type as SubscriptionType,
            name: sub.name,
            description: sub.description || undefined,
            products_amount: sub.products_amount || 1,
            last_invoice: sub.latest_invoice as Stripe.Invoice,
            payment_method: sub.payment_method_details
                ? {
                    id: sub.payment_method_details.id,
                    type: sub.payment_method_details.type as string,
                    card: sub.payment_method_details.card,
                    billing_details: sub.payment_method_details.billing_details,
                }
                : undefined,
            billing_details: sub.billing_details,
        }));

        return subscriptionsMapped;
    } catch (error) {
        console.error("get subscriptions error", error);
        return [];
    }
}

export async function getStripeProducts(): Promise<StripeProduct[]> {
    try {
        const { data } = await stripeServer.products.list();

        const products: StripeProduct[] = [];
        for (const product of data) {
            const prices = await stripeServer.prices.list({
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
        console.error("get products error", error);
        return [];
    }
}

export const createStripeSubscription = async (
    input: CreateSubscriptionInput
) => {
    try {
        const { isLoggedIn, email } = await getSession();
        if (!isLoggedIn) {
            return;
        }

        // find customer by email into db
        const customer = await Prisma.customers.findFirst({
            where: {
                email: email ?? "",
            },
        });

        if (!customer) {
            return null;
        }

        // if no exist customer, create one
        let stripeCustomer: Stripe.Customer | undefined;
        if (!customer?.stripe_customer_id) {
            stripeCustomer = await stripeServer.customers.create({
                email: customer.email ?? "",
                name: customer.full_name ?? "",
                metadata: {
                    customer_id: customer.customer_uuid,
                },
            });
            // update customer with stripe customer id
            await Prisma.customers.update({
                where: {
                    customer_uuid: customer.customer_uuid,
                },
                data: { stripe_customer_id: stripeCustomer.id },
            });

            // update session with stripe customer id
            await updateSession({
                stripeCustomerId: stripeCustomer.id,
            });
        } else {
            stripeCustomer = (await stripeServer.customers.retrieve(customer.stripe_customer_id, {
                expand: ["subscriptions"],
            })) as Stripe.Customer;
        }

        // create subscription
        const trial_period_days = 1;
        const subscription = await stripeServer.subscriptions.create({
            customer: stripeCustomer.id,
            items: [{ price: input.price_id, quantity: input.quantity }],
            metadata: {
                customer_id: customer.customer_uuid,
                plan_id: input.plan_id,
            },
            trial_period_days: trial_period_days,
            payment_behavior: "default_incomplete",
            payment_settings: { save_default_payment_method: "on_subscription" },
            expand: ["pending_setup_intent", "latest_invoice", "customer"],
        });

        const setupIntent = subscription.pending_setup_intent as Stripe.SetupIntent;
        const latestInvoice = subscription.latest_invoice as Stripe.Invoice;

        return {
            subscription_id: subscription.id,
            stripe_customer_id: subscription.customer as string,
            status: subscription.status,
            current_period_start: subscription.start_date,
            current_period_end: latestInvoice?.lines?.data[0]?.period?.end,
            trial_end: subscription.trial_end || undefined,
            cancel_at_period_end: subscription.cancel_at_period_end || false,
            payment_intent_client_secret: setupIntent?.client_secret || undefined,
        };
    } catch (error) {
        console.error("create subscription error", error);
        return null;
    }
};

export const confirmSubscription = async (subscription_id: string) => {
    try {
        const { isLoggedIn } = await getSession();
        if (!isLoggedIn) {
            return;
        }

        const subscription = await stripeServer.subscriptions.retrieve(subscription_id);
        // refresh the subscription
        await getCustomerSubscriptions();
        return subscription;
    } catch (error) {
        console.error("confirm subscription error", error);
        return null;
    }
}

export const changePaymentMethod = async (subscription_id: string) => {
    try {
        const { isLoggedIn, stripeCustomerId } = await getSession();
        if (!isLoggedIn || !stripeCustomerId) {
            return null;
        }

        const subscription = await stripeServer.subscriptions.retrieve(subscription_id);
        if (!subscription) {
            return null;
        }

        const setupIntent = await stripeServer.setupIntents.create({
            customer: stripeCustomerId,
            payment_method_types: ["card"],
            usage: "off_session",
            metadata: {
                subscription_id: subscription_id,
            },
        });

        return {
            setup_intent_id: setupIntent.id,
            client_secret: setupIntent.client_secret,
        };
    } catch (error) {
        console.error("change payment method error", error);
        return null;
    }
}

export const confirmChangePaymentMethod = async (setup_intent_id: string) => {
    try {
        const { isLoggedIn, stripeCustomerId } = await getSession();
        if (!isLoggedIn || !stripeCustomerId) {
            return {
                success: false,
                error: "User not logged in",
                setup_intent_id: null,
                payment_method_id: null,
                subscription_id: null,
            }
        }
        const currentPaymentsMethods = await stripeServer.paymentMethods.list({
            type: 'card',
            limit: 3,
            customer: stripeCustomerId
        })

        const setupIntent = await stripeServer.setupIntents.retrieve(setup_intent_id);
        if (!setupIntent || setupIntent.status !== 'succeeded') {
            return {
                success: false,
                error: "Setup intent not found or not succeeded",
                setup_intent_id: null,
                payment_method_id: null,
                subscription_id: null,
            }
        }

        // update subscription with new payment method
        const subscription_id = setupIntent.metadata?.subscription_id;
        if (!subscription_id) {
            return {
                success: false,
                error: "Subscription ID not found",
                setup_intent_id: null,
                payment_method_id: null,
                subscription_id: null,
            }
        }

        const newPaymentMethodId = setupIntent.payment_method as string;
        // delete the others payment methods and save the new payment method
        for (const payment of currentPaymentsMethods?.data) {
            if (payment?.id !== newPaymentMethodId) {
                await stripeServer.paymentMethods.detach(payment?.id)
            }
        }

        await stripeServer.subscriptions.update(subscription_id, {
            default_payment_method: newPaymentMethodId,
        });

        return {
            success: true,
            setup_intent_id: setup_intent_id,
            payment_method_id: newPaymentMethodId,
            subscription_id: subscription_id,
        };
    } catch (error) {
        console.error("confirm change payment method error", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            setup_intent_id: setup_intent_id,
            payment_method_id: null,
            subscription_id: null,
        }
    }
}