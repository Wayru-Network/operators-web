"use server";
import { Prisma } from "@/lib/infra/prisma";
import { getSession } from "@/lib/session/session";
import { SubscriptionStatus } from "../generated/prisma";

export interface SubscriptionStatusResponse {
  able: boolean;
  maxPortals: number;
}

// Function to check if the user has a valid subscription
// This function can be used in the subscription service to determine if a user has an active subscription
export async function getSubscriptionStatus(): Promise<boolean> {
  const session = await getSession();
  if (!session?.userId) {
    return false;
  }
  const userId = session.userId;

  const customer = await Prisma.customers.findFirst({
    where: {
      customer_uuid: userId,
    },
  });

  if (!customer) {
    return false;
  }
  const sub = await Prisma.subscriptions.findFirst({
    where: {
      customer_id: customer.id,
    },
  });

  const currentDate = new Date();
  let subscriptionStatus = false;
  if (sub && sub.status === "ACTIVE" && sub.expiry_date > currentDate) {
    subscriptionStatus = true;
  }
  return subscriptionStatus;
}

export async function getCustomerSubscription() {
  const session = await getSession();
  if (!session?.userId) {
    return null;
  }
  const userId = session.userId;

  const customer = await Prisma.customers.findFirst({
    where: {
      customer_uuid: userId,
    },
  });

  if (!customer) {
    return null;
  }
  const subscription = await Prisma.subscriptions.findFirst({
    where: {
      customer_id: customer.id,
    },
  });

  return subscription;
}

interface CreateSubscriptionInput {
  planId: number;
  hotspotLimit: number;

  // opcionales
  isTrial?: boolean;
  trialEndsAt?: Date;
  expiryDate: Date;
}

export async function createInitialSubscription(
  input: CreateSubscriptionInput
) {
  const {
    planId,
    hotspotLimit,
    isTrial = false,
    trialEndsAt,
    expiryDate,
  } = input;

  const customerId = await getSession();
  if (!customerId?.userId) {
    throw new Error("User not authenticated");
  }
  const customer = await Prisma.customers.findFirst({
    where: {
      customer_uuid: customerId.userId,
    },
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  const existingSubscription = await Prisma.subscriptions.findUnique({
    where: { customer_id: customer.id },
  });

  if (existingSubscription) {
    throw new Error("Customer already has a subscription");
  }

  const plan = await Prisma.subscription_plan.findUnique({
    where: { id: planId },
  });

  if (!plan) {
    throw new Error("Subscription plan not found");
  }

  const subscription = await Prisma.subscriptions.create({
    data: {
      customer_id: customer.id,
      plan_id: plan.id,

      hotspot_limit: hotspotLimit,

      status: SubscriptionStatus.ACTIVE,

      is_trial: isTrial,
      trial_ends_at: isTrial ? trialEndsAt : null,

      expiry_date: expiryDate,

      base_price_cents: plan.base_price_cents,
      currency: plan.currency,

      transactions: {
        create: {
          customer_id: customer.id,
          type: isTrial ? "TRIAL_START" : "PLAN_PURCHASE",
          amount_cents: isTrial ? 0 : plan.base_price_cents,
          currency: plan.currency,
          description: isTrial
            ? "Trial started"
            : `Initial subscription to plan ${plan.name}`,
        },
      },
    },
    include: {
      plan: true,
      customer: true,
      transactions: true,
    },
  });

  return subscription;
}
