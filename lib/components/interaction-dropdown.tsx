import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Tooltip } from "@heroui/tooltip";

interface InteractionTimeProps {
  selected: string;
  setSelected: (value: string) => void;
  validSubscription?: boolean;
}

const valueLabelMap: Record<string, string> = {
  "15": "15 Seconds",
  "30": "30 Seconds",
  "60": "1 Minute",
};

export default function InteractionTime({
  selected,
  setSelected,
  validSubscription = true,
}: InteractionTimeProps) {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(
    new Set([selected])
  );

  useEffect(() => {
    setSelectedKeys(new Set([selected]));
  }, [selected]);

  const selectedValue = React.useMemo(() => {
    const key = Array.from(selectedKeys)[0];
    return valueLabelMap[key] || "Select Time";
  }, [selectedKeys]);

  return (
    <Tooltip
      content="You need to have a premium plan to create an ad."
      placement="top"
      isDisabled={validSubscription}
      className="w-full"
      color="warning"
    >
      <div className="w-full">
        <Dropdown
          className="w-full"
          placement="bottom-start"
          isDisabled={!validSubscription}
        >
          <DropdownTrigger isDisabled={!validSubscription}>
            <Button
              className="capitalize justify-between w-full"
              variant="bordered"
              isDisabled={!validSubscription}
            >
              {selectedValue}
              <ChevronDown />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Single selection dropdown"
            selectedKeys={selectedKeys}
            selectionMode="single"
            variant="flat"
            onSelectionChange={(keys) =>
              setSelectedKeys(new Set(keys as Iterable<string>))
            }
            onAction={(key) => {
              setSelected(key as string);
            }}
          >
            <DropdownItem key="15">15 Seconds</DropdownItem>
            <DropdownItem key="30">30 Seconds</DropdownItem>
            <DropdownItem key="60">1 Minute</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </Tooltip>
  );
}
