"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import deletePortal from "../[portal]/_services/delete-porta-service";
import { useTransition } from "react";
import { useCaptivePortals } from "@/lib/hooks/use-captive-portals";

interface ModalDeletePortalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  portalId: number;
}
const ModalDeletePortal = ({
  isOpen,
  onOpen,
  onClose,
  portalId,
}: ModalDeletePortalProps) => {
  const [isLoading, startTransition] = useTransition();
  const { refreshCaptivePortals } = useCaptivePortals();

  const onConfirm = () => {
    startTransition(async () => {
      const result = await deletePortal(Number(portalId));
      if (result.success) {
        await refreshCaptivePortals();
        onClose();
      }
    });
  };

  return (
    <Modal
      size="sm"
      isOpen={isOpen}
      onOpenChange={onOpen}
      onClose={onClose}
      isDismissable={!isLoading}
      isKeyboardDismissDisabled={!isLoading}
      hideCloseButton={isLoading}
    >
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1 mt-4">
            Are you sure you want to delete this captive portal?
          </ModalHeader>
          <ModalBody>
            <p>
              If you proceed, this captive portal will be deleted and all
              associated hotspots configuration will be removed.
            </p>
            <p>This action cannot be undone.</p>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={isLoading}
              isDisabled={isLoading}
              className="w-full bg-[#751CF6] border-2 border-gray-200 dark:border-gray-700 text-white"
              variant="bordered"
              onPress={onConfirm}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};

export default ModalDeletePortal;
