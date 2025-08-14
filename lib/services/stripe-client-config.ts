"use client"
import { loadStripe } from '@stripe/stripe-js';
import { env } from '@/lib/infra/env';

export const stripeClient = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);