"use client";

import { Button } from "@heroui/button";
import { useCallback } from "react";
import createCaptivePortal from "../_services/create-captive-portal";

export default function NewPortal() {
  const handleClick = useCallback(() => {
    createCaptivePortal();
  }, []);

  return <Button onPress={handleClick}>New portal</Button>;
}
