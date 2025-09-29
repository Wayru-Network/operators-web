"use client";

import { Button } from "@heroui/button";
import { useCallback } from "react";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { Tooltip } from "@heroui/tooltip";

interface NewPortalProps {
  canCreate: boolean;
}
export default function NewPortal({ canCreate }: NewPortalProps) {
  const handleClick = useCallback(() => {
    redirect("/captive-portal/new-portal");
  }, []);

  return (
    <Tooltip
      placement="top"
      color="warning"
      isDisabled={canCreate}
      content="You have reached the maximum number of portals."
    >
      <div>
        <Button isDisabled={!canCreate} onPress={handleClick}>
          <Plus />
          Create new portal
        </Button>
      </div>
    </Tooltip>
  );
}
