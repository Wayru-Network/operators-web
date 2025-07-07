"use client";

import Image from "next/image";
import { Button } from "@heroui/button";
import { useCallback } from "react";
import createCaptivePortal from "../_services/create-captive-portal";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";

export default function NewPortal() {
  const handleClick = useCallback(() => {
    //createCaptivePortal();
    redirect("/captive-portal/new-portal");
  }, []);

  return (
    <Button onPress={handleClick}>
      <Plus />
      Create new portal
    </Button>
  );
}
