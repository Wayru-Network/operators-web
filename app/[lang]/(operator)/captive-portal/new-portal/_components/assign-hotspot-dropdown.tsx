import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import React from "react";
import { ChevronDown } from "lucide-react";
import getHotspots from "../../../hotspots/_services/get-hotspots";
import type { Selection } from "@heroui/react";

interface AssignHotspotProps {
  selected: string[];
  setSelected: (value: string[]) => void;
}

export default function AssignHotspot({
  selected,
  setSelected,
}: AssignHotspotProps) {
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set(selected)
  );
  const [hotspots, setHotspots] = React.useState<any[]>([]);

  React.useEffect(() => {
    const currentKeysArray =
      selectedKeys === "all" ? [] : Array.from(selectedKeys);
    const currentKeysSet = new Set(currentKeysArray.map(String));

    const isSame =
      selected.length === currentKeysSet.size &&
      selected.every((val) => currentKeysSet.has(val));

    if (!isSame) {
      setSelectedKeys(new Set(selected));
    }
  }, [selected]);

  React.useEffect(() => {
    getHotspots().then((data) => setHotspots(data));
  }, []);

  React.useEffect(() => {
    const newSelection = Array.from(selectedKeys === "all" ? [] : selectedKeys)
      .map(String)
      .filter((key) => key !== "none");

    const isSame =
      newSelection.length === selected.length &&
      newSelection.every((val) => selected.includes(val));

    if (!isSame) {
      setSelected(newSelection);
    }
  }, [selectedKeys]);

  const selectedValue = React.useMemo(() => {
    const values = selectedKeys === "all" ? [] : Array.from(selectedKeys);
    return values.length > 0 ? values.join(", ").replace(/_/g, "") : "none";
  }, [selectedKeys]);

  return (
    <Dropdown placement="bottom-start">
      <DropdownTrigger>
        <Button
          className="capitalize justify-between w-full max-w-xl"
          variant="bordered"
        >
          <span className="truncate max-w-[92%]">{selectedValue}</span>
          <ChevronDown />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Multiple selection example"
        closeOnSelect={false}
        disallowEmptySelection={false}
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        variant="flat"
      >
        {hotspots.map((hotspot) => (
          <DropdownItem key={hotspot["hotspot-name"]}>
            {hotspot["hotspot-name"]}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
