"use server";

import { createStripeSubscription } from "../services/stripe-service";
import { CreateSubscriptionInput } from "../interfaces/stripe";

export async function confirmSubscriptionAction(input: CreateSubscriptionInput) {
    try {
        const subscription = await createStripeSubscription(input);

        if (!subscription) {
            return { success: false, error: "Failed to create subscription" };
        }

        return {
            success: true,
            subscription,
            message: "Subscription created successfully"
        };
    } catch (error) {
        console.error("confirmSubscriptionAction error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
} 