"use server";

import { getCustomer } from "@/app/api/auth/callback/_services/customer-service";
import { Prisma } from "@/lib/infra/prisma"
import { getSession } from "@/lib/session/session";


export async function getHotspotBySubscription() {
    try {
        const { userId } = await getSession();
        if (!userId) {
            return []
        }
        const customer = await getCustomer(userId)
        if (!customer) {
            return null
        }

        const sub = await Prisma.subscriptions.findFirst({
            where: {
                customer_id: customer?.id
            }
        })
        if (!sub) {
            return []
        }
        const hotspots = await Prisma.hotspot.findMany({
            where: {
                subscription_id: sub?.id
            },

        })
        return hotspots
    } catch (error) {
        console.error('err getHotspotBySubscription', error)
        return []
    }
}