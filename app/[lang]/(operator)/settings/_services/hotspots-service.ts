"use server";
import { Prisma } from "@/lib/infra/prisma"

export async function addHotspotToSubscription(wayruDeviceId: string, subscriptionId: number) {
    try {
        const hotspot = await Prisma.hotspot.update({
            where: {
                wayru_device_id: wayruDeviceId
            },
            data: {
                subscription_id: subscriptionId
            }
        })
        return hotspot

    } catch (error) {
        console.error('error adding hotspot to subscription', error)
        return null
    }
}

export async function removeHotspotToSubscription(wayruDeviceId: string) {
    try {
        const hotspot = await Prisma.hotspot.update({
            where: {
                wayru_device_id: wayruDeviceId
            },
            data: {
                subscription_id: null
            }
        })
        return hotspot

    } catch (error) {
        console.error('error adding hotspot to subscription', error)
        return null
    }
}