
import { Prisma } from "@/lib/generated/prisma";
import { StripeSubscription } from "./stripe";


export interface CustomerSubscription extends Prisma.SubscriptionsMaxAggregateOutputType {
    stripe_subscription?: StripeSubscription
    is_subscription_active: boolean
    is_trial_period_used: boolean
    is_trialing: boolean
    has_valid_subscription: boolean
}