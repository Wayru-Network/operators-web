import { NextRequest, NextResponse } from "next/server";
import { getCustomerSubscriptions } from "@/lib/services/stripe-service";
import { getSession } from "@/lib/session/session";

export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session.isLoggedIn || !session.accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscriptions = await getCustomerSubscriptions();

    // Return only the necessary data as plain objects
    const plainSubscriptions = subscriptions.map(sub => ({
        subscription_id: sub.subscription_id,
        stripe_customer_id: sub.stripe_customer_id,
        status: sub.status,
        current_period_start: sub.current_period_start,
        current_period_end: sub.current_period_end,
        trial_end: sub.trial_end,
        cancel_at_period_end: sub.cancel_at_period_end,
        type: sub.type,
        name: sub.name,
        description: sub.description,
        products_amount: sub.products_amount,
        payment_method: sub.payment_method ? {
            id: sub.payment_method.id,
            type: sub.payment_method.type,
            card: sub.payment_method.card,
            billing_details: sub.payment_method.billing_details,
        } : undefined,
        billing_details: sub.billing_details,
    }));

    return NextResponse.json({
        success: true,
        subscriptions: plainSubscriptions
    });
} 