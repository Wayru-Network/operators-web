"use client";

import Image from "next/image";
import { Button } from "@heroui/button";
import { useCallback } from "react";
import createCaptivePortal from "../_services/create-captive-portal";
import { redirect } from "next/navigation";

export default function NewPortal() {
  const handleClick = useCallback(() => {
    //createCaptivePortal();
    redirect("/captive-portal/new-portal");
  }, []);

  return (
    <Button onPress={handleClick}>
      <Image
        src="/assets/cross.svg"
        alt="Search icon"
        width={12}
        height={12}
        className="dark:invert"
      />
      Create new portal
    </Button>
  );
}
