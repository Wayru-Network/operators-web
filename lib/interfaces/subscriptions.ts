
import { Prisma } from "@/lib/generated/prisma";
import { StripeSubscription } from "./stripe";


export interface CustomerSubscription extends Prisma.SubscriptionsMaxAggregateOutputType {
    stripe_subscription?: StripeSubscription
}