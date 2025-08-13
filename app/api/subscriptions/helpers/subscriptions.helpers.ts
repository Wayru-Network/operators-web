import { StripeSubscription } from "@/lib/interfaces/stripe";
import moment from "moment";

type StripeStatus = StripeSubscription['status'];
const ACTIVATED_STATUSES: readonly StripeStatus[] = ['active', 'trialing'] as const;

export const getSubscriptionStatusDetails = (sub?: StripeSubscription) => {
    // Early return for no subscription
    if (!sub) {
        return {
            is_subscription_active: false,
            is_trial_period_used: false,
            is_trialing: false
        };
    }

    // Check if trial period was already used
    const is_trial_period_used = sub.trial_period_end
        ? moment().isAfter(sub.trial_period_end)
        : false;

    // Check subscription status
    const is_subscription_active = ACTIVATED_STATUSES.includes(sub.status);
    const is_trialing = sub.status === 'trialing';

    return {
        is_subscription_active,
        is_trial_period_used,
        is_trialing
    };
};