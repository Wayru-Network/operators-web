"use client";

import { Button } from "@heroui/button";
import { useCallback } from "react";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";

export default function NewPortal() {
  const handleClick = useCallback(() => {
    redirect("/captive-portal/new-portal");
  }, []);

  return (
    <Button onPress={handleClick} className="ml-auto">
      <Plus />
      Create new portal
    </Button>
  );
}
