import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import React from "react";
import { ChevronDown } from "lucide-react";
import { Tooltip } from "@heroui/tooltip";

interface AdFormatProps {
  selected: string;
  setSelected: (value: string) => void;
  hasValidSubscription?: boolean;
}

export default function AdFormat({
  selected,
  setSelected,
  hasValidSubscription,
}: AdFormatProps) {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([selected]));

  React.useEffect(() => {
    setSelectedKeys(new Set([selected]));
  }, [selected]);

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replace(/_/g, ""),
    [selectedKeys]
  );

  return (
    <Tooltip
      content="You need to have a premium plan to create an ad."
      placement="top"
      isDisabled={hasValidSubscription}
      className="w-full"
      color="warning"
    >
      <div className="w-full">
        <Dropdown
          className="w-full"
          placement="bottom-start"
          isDisabled={!hasValidSubscription}
        >
          <DropdownTrigger isDisabled={!hasValidSubscription}>
            <Button
              className="capitalize justify-between w-full"
              variant="bordered"
              isDisabled={!hasValidSubscription}
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
            <DropdownItem key="video">Video</DropdownItem>
            <DropdownItem key="static">Static</DropdownItem>
            <DropdownItem key="gif">GIF</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </Tooltip>
  );
}
