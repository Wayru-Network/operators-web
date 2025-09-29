import { NextRequest, NextResponse } from "next/server";
import stripe from "stripe";
import {
  pauseSubscription,
  revokeSubscription,
} from "@/lib/services/default-settings-service";
import { env } from "@/lib/infra/env";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 }
    );
  }

  let event: stripe.Event;

  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: unknown) {
    console.error(
      `Error verifying Stripe signature: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "customer.subscription.paused": {
        const subscription = event.data.object as stripe.Subscription;
        const result = await pauseSubscription(subscription.id);
        if (result.error === "Not found") {
          return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as stripe.Subscription;
        console.log("Subscription canceled:", subscription.id);
        const result = await revokeSubscription(subscription.id);
        if (result.error === "Sub not found") {
          return NextResponse.json(
            { error: "Subscription not found" },
            { status: 404 }
          );
        }
        break;
      }
    }

    // Stripe needs a 2xx response to consider the webhook received successfully
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: unknown) {
    console.error("Error processing event:", err);
    return NextResponse.json({ error: "Processing error" }, { status: 500 });
  }
}
