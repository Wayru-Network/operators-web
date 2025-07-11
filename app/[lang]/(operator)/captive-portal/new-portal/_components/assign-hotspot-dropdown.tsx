import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import getHotspots, { Hotspot } from "../../../hotspots/_services/get-hotspots";
import type { Selection } from "@heroui/react";

interface AssignHotspotProps {
  selected: string[];
  setSelected: (value: string[]) => void;
}

export default function AssignHotspot({
  selected,
  setSelected,
}: AssignHotspotProps) {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(
    new Set(selected)
  );
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);

  useEffect(() => {
    getHotspots().then((data) => setHotspots(data));
  }, []);

  useEffect(() => {
    if (selectedKeys === "all") {
      setSelected([]);
      return;
    }

    const newSelection = Array.from(selectedKeys)
      .map(String)
      .filter((key) => key !== "none");

    const isSame =
      newSelection.length === selected.length &&
      newSelection.every((val) => selected.includes(val));

    if (!isSame) {
      setSelected(newSelection);
    }
  }, [selectedKeys, selected, setSelected]);

  const selectedValue = useMemo(() => {
    if (selectedKeys === "all") return "all";
    const values = Array.from(selectedKeys).filter((key) => key !== "none");
    return values.length > 0 ? values.join(", ").replace(/_/g, "") : "none";
  }, [selectedKeys]);

  return (
    <Dropdown placement="bottom-start">
      <DropdownTrigger>
        <Button
          className="flex w-full capitalize justify-between"
          variant="bordered"
        >
          <span className="truncate">{selectedValue}</span>
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
