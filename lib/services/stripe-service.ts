"use server";

import moment from "moment";
import { centsToDollars } from "../helpers/numbers";
import {
    CreateSubscriptionInputWithCustomer,
    StripeProduct,
    StripeProductType,
    StripeSubscription,
    SubscriptionType,
} from "../interfaces/stripe";
import { getSession } from "../session/session";
import { stripeServer } from "./stripe-server-config";
import Stripe from "stripe";
import { getCustomer } from "@/app/api/auth/callback/_services/customer-service";
import { Prisma } from "../generated/prisma";

export async function getStripeCustomerSubscription(subscriptionId: string): Promise<
    StripeSubscription | undefined
> {
    try {
        const { isLoggedIn } = await getSession();
        if (!isLoggedIn) {
            return undefined
        }

        const sub = await stripeServer.subscriptions.retrieve(subscriptionId, {
            expand: [
                "default_payment_method",
                "latest_invoice.payment_intent.payment_method",
                "items.data.price"
            ],
        });

        const product_id = sub.items.data[0].price?.product as unknown as string;
        const products_amount = sub.items.data[0].quantity;
        const product = await stripeServer.products.retrieve(product_id);

        // Get payment method details
        const paymentMethod = sub.default_payment_method as Stripe.PaymentMethod;

        // Get billing details from price
        const price = sub.items.data[0].price as Stripe.Price;
        const stripeLatestInvoice = sub?.latest_invoice as Stripe.Invoice

        // prepare latest invoice object
        const totalCents = stripeLatestInvoice.total
        const latestInvoice = (totalCents > 0 && stripeLatestInvoice.status === "paid") ? {
            invoice_id: stripeLatestInvoice?.id as string,
            total_payment: (totalCents / 100).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD'
            }),
            createdAt: stripeLatestInvoice?.created,
            invoice_pdf: stripeLatestInvoice.invoice_pdf as string
        } : null

        const subscription: StripeSubscription = {
            subscription_id: sub.id,
            status: sub.status,
            type: product.metadata?.type as SubscriptionType,
            name: product.name,
            description: product.description,
            products_amount: products_amount ?? 1,
            trial_period_start: sub.trial_start,
            trial_period_end: sub.trial_end,
            payment_method: paymentMethod
                ? {
                    id: paymentMethod.id,
                    type: paymentMethod.type,
                    last4: paymentMethod?.card?.last4,
                    brand: paymentMethod.card?.brand,
                    exp_month: paymentMethod.card?.exp_month,
                    exp_year: paymentMethod.card?.exp_year
                }
                : undefined,
            billing_details: price
                ? {
                    interval: price.recurring?.interval || 'month',
                    price_per_item: centsToDollars(price.unit_amount || 0),
                    next_payment_date: moment(sub.items.data[0].current_period_end * 1000).format("MMM DD, YYYY")
                }
                : undefined,
            latest_invoice: latestInvoice
        }


        return subscription;
    } catch (error) {
        console.error("get subscriptions error", error);
        return undefined
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
    input: CreateSubscriptionInputWithCustomer
) => {
    try {
        const { isLoggedIn, userId } = await getSession();
        if (!isLoggedIn || !userId) {
            return;
        }

        // if no exist customer, create one
        const customer = input?.customer
        const stripeCustomer = await getStripeCustomer()
        if (!stripeCustomer) return

        // create subscription
        const trial_period_days = 7;
        const subscription = await stripeServer.subscriptions.create({
            customer: stripeCustomer.id,
            items: [{ price: input.price_id, quantity: input.quantity }],
            metadata: {
                customer_id: customer.customer_uuid || "",
                plan_id: input.plan_id,
            },
            trial_period_days: trial_period_days,
            payment_behavior: "default_incomplete",
            payment_settings: { save_default_payment_method: "on_subscription" },
            expand: ["pending_setup_intent", "latest_invoice", "customer"],
        } as Stripe.SubscriptionCreateParams);

        const setupIntent = subscription.pending_setup_intent as Stripe.SetupIntent;
        const latestInvoice = subscription.latest_invoice as Stripe.Invoice;

        return {
            subscription_id: subscription.id,
            stripe_customer_id: stripeCustomer.id,
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
        return subscription;
    } catch (error) {
        console.error("confirm subscription error", error);
        return null;
    }
}

export const changePaymentMethod = async (subscription_id: string) => {
    try {
        const { isLoggedIn, userId } = await getSession();
        if (!isLoggedIn || !userId) {
            return null;
        }

        // get customer details
        const customer = await getCustomer(userId)
        if (!customer || !customer?.stripe_customer_id) {
            return null
        }
        const stripeCustomerId = customer?.stripe_customer_id

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
        const { isLoggedIn, userId } = await getSession();
        if (!isLoggedIn || !userId) {
            return {
                success: false,
                error: "User not logged in",
                setup_intent_id: null,
                payment_method_id: null,
                subscription_id: null,
            }
        }

        // get customer details
        const customer = await getCustomer(userId)
        if (!customer || !customer?.stripe_customer_id) {
            return {
                success: false,
                error: "Stripe customer id not found",
                setup_intent_id: null,
                payment_method_id: null,
                subscription_id: null,
            }
        }
        const stripeCustomerId = customer?.stripe_customer_id


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

export const getStripeCustomer = async () => {
    const { isLoggedIn, userId } = await getSession();
    if (!isLoggedIn || !userId) {
        return null
    }

    // get customer details 
    const customer = await getCustomer(userId) as Prisma.CustomersGroupByOutputType
    let stripeCustomer: Stripe.Customer | null = null

    if (customer?.stripe_customer_id) {
        stripeCustomer = await stripeServer.customers.retrieve(customer.stripe_customer_id, {
            expand: ["subscriptions"],
        }) as unknown as Stripe.Customer
    } else {
        stripeCustomer = await stripeServer.customers.create({
            email: customer.email || "",
            name: customer.full_name || "",
            metadata: {
                customer_id: customer.customer_uuid || "",
            },
        } as Stripe.CustomerCreateParams)
    }

    return { ...stripeCustomer, customer_database_id: customer?.id }
}