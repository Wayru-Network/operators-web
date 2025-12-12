"use client";

import { Button } from "@heroui/button";
import { useCallback, useMemo } from "react";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { Tooltip } from "@heroui/tooltip";
import { CanCreatePortalResponse } from "../new-portal/_services/can-create-portal";

interface NewPortalProps {
  canCreate: CanCreatePortalResponse;
}
export default function NewPortal({ canCreate }: NewPortalProps) {
  const handleClick = useCallback(() => {
    redirect("/captive-portal/new-portal");
  }, []);

  return (
    <Tooltip
      placement="top"
      color="warning"
      isDisabled={canCreate.able}
      content="You have reached the maximum number of portals."
    >
      <div>
        <Button isDisabled={!canCreate.able} onPress={handleClick}>
          <Plus />
          Create new portal
        </Button>
      </div>
    </Tooltip>
  );
}
