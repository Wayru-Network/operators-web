import { Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { useDisclosure } from "@heroui/react";
import { Pencil, Settings, Trash } from "lucide-react";
import { useState } from "react";
import ModalDeletePortal from "./modal-delete-portal";

const PortalActions = ({ portalId }: { portalId: number | string }) => {
  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();
  const [isOpenPopover, setIsOpenPopover] = useState(false);

  return (
    <div className="flex items-center justify-center hover:underline">
      <ModalDeletePortal
        isOpen={isOpenModal}
        onOpen={onOpenModal}
        onClose={onCloseModal}
        portalId={Number(portalId)}
      />
      <Popover
        placement="left"
        showArrow={true}
        color="foreground"
        isOpen={isOpenPopover}
        onOpenChange={(open) => setIsOpenPopover(open)}
      >
        <PopoverTrigger>
          <Settings
            className="cursor-pointer focus:outline-none focus:ring-0 focus-visible:outline-none"
            onClick={() => setIsOpenPopover(true)}
          />
        </PopoverTrigger>
        <PopoverContent>
          <div className="px-3 py-2 w-[210px]">
            <span className="font-semibold text-[14px]">Actions</span>
            <div className="flex flex-col gap-3 mt-3">
              <div
                className="flex flex-row items-center gap-2 w-full justify-between cursor-pointer"
                onClick={() => {
                  onOpenModal();
                  setIsOpenPopover(false);
                }}
              >
                <span className="text-red-500 cursor-pointer font-normal text-sm">
                  Delete captive portal
                </span>
                <Trash className="w-4 h-4 text-red-500" />
              </div>
              <a
                className="flex flex-row items-center gap-2 w-full justify-between cursor-pointer"
                href={`/captive-portal/${portalId}`}
              >
                <span className="cursor-pointer font-normal text-sm">
                  Edit captive portal
                </span>
                <Pencil className="w-4 h-4 text-gray-500" />
              </a>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PortalActions;
