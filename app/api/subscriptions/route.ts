import { NextResponse } from "next/server";
import { getSession } from "@/lib/session/session";
import { getCustomerSubscription } from "./_services/subscriptions-service";

export async function GET() {
    const session = await getSession();
    if (!session.isLoggedIn || !session.accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscriptions = await getCustomerSubscription();

    return NextResponse.json({
        success: true,
        subscription: subscriptions
    });
} 