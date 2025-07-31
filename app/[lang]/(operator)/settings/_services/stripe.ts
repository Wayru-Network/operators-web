"use client"
import { loadStripe } from '@stripe/stripe-js';

console.log("stripe pub key", process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
export const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);