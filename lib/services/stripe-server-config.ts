import Stripe from "stripe";
import { env } from "@/lib/infra/env";

export const stripeServer = new Stripe(env.STRIPE_SECRET_KEY?.trim() || "");