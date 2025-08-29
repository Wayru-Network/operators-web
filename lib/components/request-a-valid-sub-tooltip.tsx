import { Tooltip } from "@heroui/tooltip";
import { useCustomerSubscription } from "../contexts/customer-subscription-context";

interface RequestAValidSubTooltipProps {
  children: React.ReactNode;
  isDisabled: boolean;
  content?: string;
}

export default function RequestAValidSubTooltip({
  children,
  isDisabled,
  content,
}: RequestAValidSubTooltipProps) {
  const { subscription } = useCustomerSubscription();
  const hasValidSubscription = subscription?.has_valid_subscription;

  return (
    <Tooltip
      placement="top"
      isDisabled={isDisabled || hasValidSubscription}
      color="warning"
      content={content ?? "You need to have a valid subscription to do this"}
    >
      <div>{children}</div>
    </Tooltip>
  );
}
