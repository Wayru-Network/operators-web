"use client";

import { Button } from "@heroui/button";
import { useCallback, useMemo } from "react";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { Tooltip } from "@heroui/tooltip";
import { CanCreatePortalResponse } from "../new-portal/_services/can-create-portal";

interface NewPortalProps {
  canCreate: CanCreatePortalResponse;
  portalsCount: number;
}
export default function NewPortal({ canCreate, portalsCount }: NewPortalProps) {
  const handleClick = useCallback(() => {
    redirect("/captive-portal/new-portal");
  }, []);

  const create = useMemo(
    () => canCreate.maxPortals >= portalsCount,
    [canCreate, portalsCount]
  );

  return (
    <Tooltip
      placement="top"
      color="warning"
      isDisabled={create}
      content="You have reached the maximum number of portals."
    >
      <div>
        <Button isDisabled={!create} onPress={handleClick}>
          <Plus />
          Create new portal
        </Button>
      </div>
    </Tooltip>
  );
}
