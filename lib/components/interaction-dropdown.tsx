import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import React from "react";
import { ChevronDown } from "lucide-react";

interface InteractionTimeProps {
  selected: string;
  setSelected: (value: string) => void;
}

export default function InteractionTime({
  selected,
  setSelected,
}: InteractionTimeProps) {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([selected]));

  React.useEffect(() => {
    setSelectedKeys(new Set([selected]));
  }, [selected]);

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replace(/_/g, ""),
    [selectedKeys]
  );

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
        <DropdownItem key="15 seconds">15 Seconds</DropdownItem>
        <DropdownItem key="30 seconds">30 Seconds</DropdownItem>
        <DropdownItem key="1 minute">1 Minute</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
