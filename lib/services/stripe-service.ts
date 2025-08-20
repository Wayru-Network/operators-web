"use server";

import moment from "moment";
import { centsToDollars } from "../helpers/numbers";
import {
    CreateSubscriptionInput,
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
import { Prisma as generatedPrisma } from "../generated/prisma";
import { calculateDiscountSummary } from "../helpers/stripe-helper";
import { Prisma } from "../infra/prisma";

export async function getStripeCustomerSubscription(
    subscriptionId: string
): Promise<StripeSubscription | undefined> {
    try {
        const { isLoggedIn } = await getSession();
        if (!isLoggedIn) {
            return undefined;
        }

        const sub = await stripeServer.subscriptions.retrieve(subscriptionId, {
            expand: [
                "default_payment_method",
                "latest_invoice.payment_intent.payment_method",
                "items.data.price",
            ],
        });

        const product_id = sub.items.data[0].price?.product as unknown as string;
        const products_amount = sub.items.data[0].quantity;
        const product = await stripeServer.products.retrieve(product_id);

        // Get payment method details
        const paymentMethod = sub.default_payment_method as Stripe.PaymentMethod;

        // Get billing details from price
        const price = sub.items.data[0].price as Stripe.Price;
        const stripeLatestInvoice = sub?.latest_invoice as Stripe.Invoice;

        // prepare latest invoice object
        const totalCents = stripeLatestInvoice.total;
        const latestInvoice =
            totalCents > 0 && stripeLatestInvoice.status === "paid"
                ? {
                    invoice_id: stripeLatestInvoice?.id as string,
                    total_payment: (totalCents / 100).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                    }),
                    createdAt: stripeLatestInvoice?.created,
                    invoice_pdf: stripeLatestInvoice.invoice_pdf as string,
                }
                : null;

        const subscription: StripeSubscription = {
            subscription_id: sub.id,
            status: sub.status,
            type: product.metadata?.type as SubscriptionType,
            name: product.name,
            description: product.description,
            products_amount: products_amount ?? 1,
            trial_period_start: sub.trial_start,
            trial_period_end: sub.trial_end,
            current_period_end:
                sub?.items?.data?.length > 0
                    ? sub?.items?.data[0].current_period_end
                    : null,
            cancel_at: sub.cancel_at,
            cancellation_reason: sub?.cancellation_details?.reason,
            payment_method: paymentMethod
                ? {
                    id: paymentMethod.id,
                    type: paymentMethod.type,
                    last4: paymentMethod?.card?.last4,
                    brand: paymentMethod.card?.brand,
                    exp_month: paymentMethod.card?.exp_month,
                    exp_year: paymentMethod.card?.exp_year,
                }
                : undefined,
            billing_details: price
                ? {
                    interval: price.recurring?.interval || "month",
                    price_per_item: centsToDollars(price.unit_amount || 0),
                    next_payment_date: moment(
                        sub.items.data[0].current_period_end * 1000
                    ).format("MMM DD, YYYY"),
                }
                : undefined,
            latest_invoice: latestInvoice,
        };

        return subscription;
    } catch (error) {
        console.error("get subscriptions error", error);
        return undefined;
    }
}

const STRIPE_FIXED_FEE = 0.3;
const STRIPE_PERCENT_FEE = 0.06;

function priceWithoutFee(stripePrice: number): number {
    const net = (stripePrice - STRIPE_FIXED_FEE) / (1 + STRIPE_PERCENT_FEE);
    return parseFloat(net.toFixed(2));
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

            const priceDetails = prices.data.map((price) => {
                const priceAmount = centsToDollars(price.unit_amount || 0);
                return {
                    id: price.id,
                    currency: price.currency,
                    recurring: price.recurring,
                    active: price.active,
                    // price amount from stripe include the internal fee
                    price_with_fee: Number(priceAmount.toFixed(2)),
                    price_without_fee: priceWithoutFee(priceAmount),
                };
            }) as StripeProduct["priceDetails"];

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
        const customer = input?.customer;
        const stripeCustomer = await getStripeCustomer();
        if (!stripeCustomer) return;

        // if the subscription have more than 1 hotspot add a coupon
        let coupon: Stripe.Response<Stripe.Coupon> | null = null;
        if (input.quantity > 1) {
            const { percentOff } = calculateDiscountSummary(
                input.quantity,
                input?.base_price_with_fee
            );

            coupon = await stripeServer.coupons.create({
                percent_off: percentOff,
                currency: "usd",
                duration: "forever",
                name: `discount for amount: ${input.quantity} hotspots`,
            });
        }
        const discounts = coupon
            ? [
                {
                    coupon: coupon?.id,
                },
            ]
            : null;

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
            discounts: discounts,
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

        const subscription = await stripeServer.subscriptions.retrieve(
            subscription_id
        );
        return subscription;
    } catch (error) {
        console.error("confirm subscription error", error);
        return null;
    }
};

export const changePaymentMethod = async (subscription_id: string) => {
    try {
        const { isLoggedIn, userId } = await getSession();
        if (!isLoggedIn || !userId) {
            return null;
        }

        // get customer details
        const customer = await getCustomer(userId);
        if (!customer || !customer?.stripe_customer_id) {
            return null;
        }
        const stripeCustomerId = customer?.stripe_customer_id;

        const subscription = await stripeServer.subscriptions.retrieve(
            subscription_id
        );
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
};

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
            };
        }

        // get customer details
        const customer = await getCustomer(userId);
        if (!customer || !customer?.stripe_customer_id) {
            return {
                success: false,
                error: "Stripe customer id not found",
                setup_intent_id: null,
                payment_method_id: null,
                subscription_id: null,
            };
        }
        const stripeCustomerId = customer?.stripe_customer_id;

        const currentPaymentsMethods = await stripeServer.paymentMethods.list({
            type: "card",
            limit: 3,
            customer: stripeCustomerId,
        });

        const setupIntent = await stripeServer.setupIntents.retrieve(
            setup_intent_id
        );
        if (!setupIntent || setupIntent.status !== "succeeded") {
            return {
                success: false,
                error: "Setup intent not found or not succeeded",
                setup_intent_id: null,
                payment_method_id: null,
                subscription_id: null,
            };
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
            };
        }

        const newPaymentMethodId = setupIntent.payment_method as string;
        // delete the others payment methods and save the new payment method
        for (const payment of currentPaymentsMethods?.data) {
            if (payment?.id !== newPaymentMethodId) {
                await stripeServer.paymentMethods.detach(payment?.id);
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
        };
    }
};

export const getStripeCustomer = async () => {
    const { isLoggedIn, userId } = await getSession();
    if (!isLoggedIn || !userId) {
        return null;
    }

    // get customer details
    const customer = (await getCustomer(
        userId
    )) as generatedPrisma.CustomersGroupByOutputType;
    let stripeCustomer: Stripe.Customer | null = null;

    if (customer?.stripe_customer_id) {
        stripeCustomer = (await stripeServer.customers.retrieve(
            customer.stripe_customer_id,
            {
                expand: ["subscriptions"],
            }
        )) as unknown as Stripe.Customer;
    } else {
        stripeCustomer = await stripeServer.customers.create({
            email: customer.email || "",
            name: customer.full_name || "",
            metadata: {
                customer_id: customer.customer_uuid || "",
            },
        } as Stripe.CustomerCreateParams);
    }

    return { ...stripeCustomer, customer_database_id: customer?.id };
};

export const createCustomerSubscription = async (
    params: CreateSubscriptionInput
) => {
    const { userId } = await getSession();
    const customer = await getCustomer(userId as string);

    const stripeSub = await createStripeSubscription({
        ...params,
        customer: {
            name: customer?.full_name,
            email: customer?.email as string,
            customer_uuid: customer?.customer_uuid,
            stripe_customer_id: customer?.stripe_customer_id as string,
        },
    });
    if (!stripeSub) {
        return {
            error: true,
            message: "stripe internal error",
            payment_intent_client_secret: undefined,
        };
    }

    // update the customer with the data
    await Prisma.customers.update({
        where: {
            customer_uuid: userId,
        },
        data: {
            stripe_customer_id: stripeSub?.stripe_customer_id,
        },
    });

    // update the subscription of db
    await Prisma.subscriptions.update({
        where: {
            customer_id: customer?.id,
        },
        data: {
            stripe_subscription_id: stripeSub?.subscription_id,
            hotspot_limit: params?.quantity,
        },
    });

    return {
        error: false,
        message: "subscription created",
        payment_intent_client_secret: stripeSub.payment_intent_client_secret,
    };
};

export const createTrialSubscription = async (
    params: CreateSubscriptionInput
) => {
    const customer = await getStripeCustomer();
    if (!customer) {
        return {
            error: true,
            message: "Customer not found",
        };
    }

    // check if the user already has a subscription
    const subDb = await Prisma.subscriptions.findFirst({
        where: {
            customer_id: customer?.customer_database_id,
        },
    });
    if (subDb?.stripe_subscription_id) {
        const stripeSubscription = await getStripeCustomerSubscription(
            subDb?.stripe_subscription_id
        );
        if (stripeSubscription) {
            return {
                error: true,
                message: "Customer already have a subscription",
            };
        }
    }

    try {
        // if the subscription have more than 1 hotspot add a coupon
        let coupon: Stripe.Response<Stripe.Coupon> | null = null;
        if (params.quantity > 1) {
            const { percentOff } = calculateDiscountSummary(
                params.quantity,
                params?.base_price_with_fee
            );

            coupon = await stripeServer.coupons.create({
                percent_off: percentOff,
                currency: "usd",
                duration: "forever",
                name: `discount for amount: ${params.quantity} hotspots`,
            });
        }

        // Create Stripe subscription with trial period but no payment method
        const discounts = coupon
            ? [
                {
                    coupon: coupon?.id,
                },
            ]
            : null;
        const subscription = await stripeServer.subscriptions.create({
            customer: customer.id as string,
            items: [
                {
                    price: params.price_id,
                    quantity: params.quantity,
                },
            ],
            trial_period_days: 7,
            collection_method: "charge_automatically",
            payment_behavior: "default_incomplete",
            payment_settings: {
                save_default_payment_method: "on_subscription",
            },
            expand: ["latest_invoice.payment_intent"],
            discounts: discounts,
        });

        // Update the subscription in database
        await Prisma.subscriptions.update({
            where: {
                customer_id: customer.customer_database_id,
            },
            data: {
                stripe_subscription_id: subscription.id,
                hotspot_limit: params.quantity,
            },
        });

        return {
            error: false,
            message: "Trial subscription created successfully",
            subscription_id: subscription.id,
        };
    } catch (error) {
        console.error("Error creating trial subscription:", error);
        return {
            error: true,
            message: "Failed to create trial subscription",
        };
    }
};

export const updateHotspotAmountSubscription = async (params: {
    quantity: number;
    basePrice: number;
}) => {
    try {
        const { userId } = await getSession();
        if (!userId) {
            return {
                error: true,
                message: "User not authenticated",
            };
        }

        const customer = await getCustomer(userId);
        if (!customer) {
            return {
                error: true,
                message: "Customer not found",
            };
        }

        // Get the current subscription
        const subscription = await Prisma.subscriptions.findFirst({
            where: {
                customer_id: customer.id,
            },
        });

        if (!subscription?.stripe_subscription_id) {
            return {
                error: true,
                message: "No active subscription found",
            };
        }

        // Get the current Stripe subscription to find the subscription item ID
        const currentStripeSubscription = await stripeServer.subscriptions.retrieve(
            subscription.stripe_subscription_id,
            { expand: ["discounts"] }
        );

        if (!currentStripeSubscription.items?.data?.[0]?.id) {
            return {
                error: true,
                message: "No subscription items found",
            };
        }

        const subscriptionItemId = currentStripeSubscription.items.data[0].id;

        // if subscription has an active coupons delete
        const discounts = currentStripeSubscription.discounts as Stripe.Discount[];
        for (const discount of discounts) {
            try {
                await stripeServer.coupons.del(discount.coupon.id);
            } catch (e) {
                console.warn(`Coupon deleted not found: ${discount.coupon.id}:`, e);
            }
        }

        // if the subscription have more than 1 hotspot add a coupon
        let coupon: Stripe.Response<Stripe.Coupon> | null = null;
        if (params.quantity > 1) {
            const { percentOff } = calculateDiscountSummary(
                params.quantity,
                params?.basePrice
            );

            coupon = await stripeServer.coupons.create({
                percent_off: percentOff,
                currency: "usd",
                duration: "forever",
                name: `discount for amount: ${params.quantity} hotspots`,
            });
        }

        // Update the subscription in Stripe
        const newDiscounts = coupon
            ? [
                {
                    coupon: coupon?.id,
                },
            ]
            : null;

        const updatedStripeSubscription = await stripeServer.subscriptions.update(
            subscription.stripe_subscription_id,
            {
                items: [
                    {
                        id: subscriptionItemId,
                        quantity: params.quantity,
                    },
                ],
                proration_behavior: "create_prorations",
                discounts: newDiscounts,
            }
        );

        if (!updatedStripeSubscription) {
            return {
                error: true,
                message: "Failed to update Stripe subscription",
            };
        }

        // Update the hotspot_limit in our database
        await Prisma.subscriptions.update({
            where: {
                customer_id: customer.id,
            },
            data: {
                hotspot_limit: params.quantity,
            },
        });

        return {
            error: false,
            message: "Your subscription was updated successfully",
        };
    } catch (error) {
        console.error("Error updating subscription:", error);
        return {
            error: true,
            message: "Failed to update subscription",
        };
    }
};

export const cancelSubscription = async ({ subId, feedback, comment }: {
    subId: string;
    feedback?: Stripe.Subscription.CancellationDetails.Feedback;
    comment?: string
}) => {
    try {
        const currentSub = await stripeServer.subscriptions.retrieve(subId);
        if (!currentSub) {
            return {
                error: true,
                message: "Subscription not found",
            };
        }

        // check sub status
        if (currentSub.status === "canceled") {
            return {
                error: true,
                message: "Subscription already canceled",
            };
        }

        // update current sub
        await stripeServer.subscriptions.update(subId, {
            cancel_at_period_end: true,
            cancellation_details: {
                feedback,
                comment
            },
        });

        return {
            error: false,
            message:
                "Subscription is going to be canceled when the current period end",
        };
    } catch (e) {
        console.log("Err cancelSubscription", e);
        return {
            error: false,
            message: "Error canceling subscription",
        };
    }
};
