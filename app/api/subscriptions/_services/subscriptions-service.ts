"use server"

import { Prisma } from "@/lib/infra/prisma";
import { getStripeCustomerSubscription, createStripeSubscription } from "@/lib/services/stripe-service";
import { getSession } from "@/lib/session/session";
import { CustomerSubscription } from "@/lib/interfaces/subscriptions";
import { getCustomer } from "../../auth/callback/_services/customer-service";
import { CreateSubscriptionInput } from "@/lib/interfaces/stripe";
import moment from "moment";

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

        // if sub has a stripe subscription id return this too
        if (sub?.stripe_subscription_id) {
            const stripeSubscription = await getStripeCustomerSubscription(sub?.stripe_subscription_id)
            return {
                ...sub,
                stripe_subscription: stripeSubscription
            }
        }

        return sub
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
            trial_start: moment().toDate(),
            trial_end: moment().add(7, 'days').toDate(),
            hotspot_limit: params?.quantity
        }
    })

    return {
        error: false,
        message: 'subscription created',
        payment_intent_client_secret: stripeSub.payment_intent_client_secret
    }
}