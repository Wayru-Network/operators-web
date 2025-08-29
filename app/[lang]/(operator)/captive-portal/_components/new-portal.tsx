"use client";

import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { useCallback } from "react";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { useCustomerSubscription } from "@/lib/contexts/customer-subscription-context";
import Stripe from "stripe";
import RequestAValidSubTooltip from "@/lib/components/request-a-valid-sub-tooltip";
const AVAILABLE_STATUS: Array<Stripe.Subscription.Status> = [
  "active",
  "trialing",
];

interface NewPortalProps {
  currentPortals: number;
}
export default function NewPortal({ currentPortals }: NewPortalProps) {
  const { subscription } = useCustomerSubscription();
  const hasValidSubscription = subscription?.has_valid_subscription;
  const requiredSubscription = !hasValidSubscription && currentPortals >= 1;

  const handleClick = useCallback(() => {
    redirect("/captive-portal/new-portal");
  }, []);

  return (
    <RequestAValidSubTooltip
      isDisabled={requiredSubscription ? false : true}
      content="You need to have an active subscription to create more than 1 portal"
    >
      <Button isDisabled={requiredSubscription} onPress={handleClick}>
        <Plus />
        Create new portal
      </Button>
    </RequestAValidSubTooltip>
  );
}
