import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

interface InteractionTimeProps {
  selected: string;
  setSelected: (value: string) => void;
}

const valueLabelMap: Record<string, string> = {
  "15": "15 Seconds",
  "30": "30 Seconds",
  "60": "1 Minute",
};

export default function InteractionTime({
  selected,
  setSelected,
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
    <Dropdown placement="bottom-start">
      <DropdownTrigger>
        <Button className="capitalize justify-between" variant="bordered">
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
  );
}
