"use server"

import { Prisma } from "@/lib/infra/prisma";
import { getStripeCustomerSubscription, createStripeSubscription, getStripeCustomer } from "@/lib/services/stripe-service";
import { getSession } from "@/lib/session/session";
import { CustomerSubscription } from "@/lib/interfaces/subscriptions";
import { getCustomer } from "../../auth/callback/_services/customer-service";
import { CreateSubscriptionInput } from "@/lib/interfaces/stripe";
import { getSubscriptionStatusDetails } from "../helpers/subscriptions.helpers";
import { stripeServer } from "@/lib/services/stripe-server-config";

// get or create a subscription for one user
export async function getCustomerSubscription(): Promise<CustomerSubscription | null> {
    try {
        const { userId } = await getSession();
        if (!userId) {
            return null
        }

        // first get the customer 
        const customer = await getCustomer(userId)
        if (!customer) {
            return null
        }
        const customerId = customer?.id

        let sub = await Prisma.subscriptions.findFirst({
            where: {
                customer_id: customerId
            }
        })
        if (!sub) {
            // create a sub 
            sub = await Prisma.subscriptions.create({
                data: {
                    customer_id: customerId,
                    hotspot_limit: 0
                }
            })
        }

        // format response
        const response = {
            ...sub,
            is_subscription_active: false,
            is_trial_period_used: false,
            is_trialing: false
        }

        // if sub has a stripe subscription id return this too
        if (sub?.stripe_subscription_id) {
            const stripeSubscription = await getStripeCustomerSubscription(sub?.stripe_subscription_id)
            const statusDetails = getSubscriptionStatusDetails(stripeSubscription)
            return {
                ...response,
                stripe_subscription: stripeSubscription,
                is_subscription_active: statusDetails.is_subscription_active,
                is_trial_period_used: statusDetails.is_trial_period_used,
                is_trialing: statusDetails.is_trialing,
            }
        }

        return response
    } catch (error) {
        console.log('getStripeCustomerSubscription error', error)
        return null
    }
}

export const createCustomerSubscription = async (params: CreateSubscriptionInput) => {
    const { userId } = await getSession()
    const customer = await getCustomer(userId as string)

    const stripeSub = await createStripeSubscription({
        ...params, customer: {
            name: customer?.full_name,
            email: customer?.email as string,
            customer_uuid: customer?.customer_uuid,
            stripe_customer_id: customer?.stripe_customer_id as string
        }
    })
    if (!stripeSub) {
        return {
            error: true,
            message: 'stripe internal error',
            payment_intent_client_secret: undefined
        }
    }

    // update the customer with the data
    await Prisma.customers.update({
        where: {
            customer_uuid: userId
        },
        data: {
            stripe_customer_id: stripeSub?.stripe_customer_id
        }
    })

    // update the subscription of db
    await Prisma.subscriptions.update({
        where: {
            customer_id: customer?.id,
        },
        data: {
            stripe_subscription_id: stripeSub?.subscription_id,
            hotspot_limit: params?.quantity
        }
    })

    return {
        error: false,
        message: 'subscription created',
        payment_intent_client_secret: stripeSub.payment_intent_client_secret
    }
}

export const createTrialSubscription = async (params: CreateSubscriptionInput) => {
    const customer = await getStripeCustomer()
    if (!customer) {
        return {
            error: true,
            message: 'Customer not found',
        }
    }

    // check if the user already has a subscription
    const subDb = await Prisma.subscriptions.findFirst({
        where: {
            customer_id: customer?.customer_database_id
        }
    })
    if (subDb?.stripe_subscription_id) {
        const stripeSubscription = await getStripeCustomerSubscription(subDb?.stripe_subscription_id)
        if (stripeSubscription) {
            return {
                error: true,
                message: 'Customer already have a subscription',
            }
        }
    }

    try {
        // Create Stripe subscription with trial period but no payment method
        const subscription = await stripeServer.subscriptions.create({
            customer: customer.id as string,
            items: [{
                price: params.price_id,
                quantity: params.quantity,
            }],
            trial_period_days: 7,
            collection_method: 'charge_automatically',
            payment_behavior: 'default_incomplete',
            payment_settings: {
                save_default_payment_method: 'on_subscription',
            },
            expand: ['latest_invoice.payment_intent'],
        });

        // Update the subscription in database
        await Prisma.subscriptions.update({
            where: {
                customer_id: customer.customer_database_id
            },
            data: {
                stripe_subscription_id: subscription.id,
                hotspot_limit: params.quantity
            }
        });

        return {
            error: false,
            message: 'Trial subscription created successfully',
            subscription_id: subscription.id,
        }
    } catch (error) {
        console.error('Error creating trial subscription:', error);
        return {
            error: true,
            message: 'Failed to create trial subscription',
        }
    }
}