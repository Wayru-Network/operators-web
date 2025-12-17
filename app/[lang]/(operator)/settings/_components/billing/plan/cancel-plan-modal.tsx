import React, { useState, useTransition } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { addToast } from "@heroui/toast";
import { useCustomerSubscription } from "@/lib/contexts/customer-subscription-context";
import moment from "moment";
import Stripe from "stripe";
import { AnimatePresence, motion } from "framer-motion";

type StripeFeedBack = Stripe.Subscription.CancellationDetails.Feedback;
interface Reason {
  key: StripeFeedBack;
  label: string;
}
interface Props {
  isOpen: boolean;
  onClose: () => void;
  subId: string;
}
export default function CancelPlanModal({ isOpen, onClose }: Props) {
  const [isCancelling, startTransition] = useTransition();
  const { subscription } = useCustomerSubscription();
  const hotspotSubscription = subscription?.stripe_subscription;
  const [selectedReason, setSelectedReason] = useState<Reason | null>(null);
  //const [setComment] = useState("");
  const currentPeriodEnd = moment(
    Number(hotspotSubscription?.current_period_end) * 1000
  ).format("MMM DD, YYYY");

  const onConfirm = () => {
    startTransition(async () => {
      addToast({
        title: "Success",
        description: "Your subscription has been canceled.",
        color: "success",
      });
      onClose();
    });
  };

  const reasons: Array<Reason> = [
    { key: "customer_service", label: "Customer service" },
    { key: "low_quality", label: "Low quality" },
    { key: "missing_features", label: "Missing features" },
    { key: "switched_service", label: "Switched service" },
    { key: "too_complex", label: "Too complex" },
    { key: "too_expensive", label: "Too expensive" },
    { key: "unused", label: "Unused" },
    { key: "other", label: "Other" },
  ];

  return (
    <>
      <Modal
        isDismissable={false}
        backdrop={"blur"}
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior={"normal"}
        hideCloseButton={isCancelling}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Are you sure you want to cancel your subscription?
              </ModalHeader>
              <ModalBody>
                <p>
                  If you proceed, your hotspot configuration will be reverted
                  and your current plan will be deactivated.
                </p>
                <p>
                  Your subscription will remain active until the end of the
                  current billing cycle, which ends on{" "}
                  <strong>{currentPeriodEnd}</strong>. After that date, no
                  further charges will apply.
                </p>
                <p>
                  Any discounts or custom pricing associated with your plan will
                  be lost. You can re-subscribe at any time, but pricing and
                  availability may differ.
                </p>
                <Select
                  className="w-full mt-2"
                  placeholder="Add a reason to cancel"
                  aria-label="Reason to cancel:"
                  label={selectedReason ? "Reason to cancel:" : null}
                  color="default"
                  renderValue={(items) => {
                    return items.map((item) => (
                      <span
                        className="text-[#000000] dark:text-[#ffffff] text-xs"
                        key={item.key}
                      >
                        {item.textValue}
                      </span>
                    ));
                  }}
                >
                  {reasons.map((reason) => (
                    <SelectItem
                      onPress={() => setSelectedReason(reason)}
                      key={reason.key}
                    >
                      {reason.label}
                    </SelectItem>
                  ))}
                </Select>
                <AnimatePresence>
                  {selectedReason?.key === "other" && (
                    <motion.div
                      key="reason-details"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <Textarea
                        id="custom-text-area"
                        className="text-[#000000] dark:text-[#ffffff] text-xs w-full"
                        label="Reason details:"
                        placeholder="Enter your reason"
                        variant="faded"
                        maxRows={3}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </ModalBody>

              <ModalFooter>
                <Button
                  className="w-full bg-[#751CF6] border-2 border-gray-200 dark:border-gray-700 text-white"
                  variant="bordered"
                  isDisabled={isCancelling}
                  isLoading={isCancelling}
                  onPress={onConfirm}
                >
                  {isCancelling
                    ? "Canceling subscription"
                    : "Cancel subscription"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
