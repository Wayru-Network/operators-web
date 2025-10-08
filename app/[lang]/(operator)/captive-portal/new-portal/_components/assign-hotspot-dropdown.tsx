"use client";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, Star } from "lucide-react";
import type { Selection } from "@heroui/react";
import { Hotspot } from "../../../hotspots/_services/get-hotspots";

interface AssignHotspotProps {
  selected: string[];
  setSelected: (value: string[]) => void;
  hotspots: Hotspot[];
}

export default function AssignHotspot({
  selected,
  setSelected,
  hotspots,
}: AssignHotspotProps) {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(
    new Set(selected)
  );

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
    const keysArray = Array.from(selectedKeys).filter(
      (key) => key !== "none"
    ) as string[];
    if (keysArray.length === 0) return "none";

    const names = keysArray
      .map((k) => hotspots.find((h) => h.wayru_device_id === k)?.name)
      .filter((n): n is string => !!n);

    return names.join(", ");
  }, [selectedKeys, hotspots]);

  return (
    <Dropdown placement="bottom-start">
      <DropdownTrigger asChild>
        <Button
          className="flex w-full capitalize justify-between"
          variant="bordered"
        >
          <span className="truncate">{selectedValue}</span>
          <ChevronDown />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Assign Hotspot"
        closeOnSelect={false}
        disallowEmptySelection={false}
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        variant="flat"
        className="max-h-[300px] overflow-y-auto"
      >
        {hotspots.map((hotspot) => (
          <DropdownItem
            key={hotspot.wayru_device_id}
            value={hotspot.wayru_device_id}
          >
            {hotspot.subbed ? (
              <div className="flex items-center">
                <Star size={18} color="white" className="mr-2" />
                {hotspot.name}
              </div>
            ) : (
              <>{hotspot.name}</>
            )}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
