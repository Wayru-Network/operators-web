"use client";

import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import type { SharedSelection } from "@heroui/system";
import { SupportedLanguages } from "../language/language";
import { useMemo, useState } from "react";
import { Globe } from "lucide-react";

export default function LangSwitch() {
  const [selectedKeys, setSelectedKeys] = useState<SharedSelection>(
    new Set(["en"]),
  );

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", ").replace(/_/g, ""),
    [selectedKeys],
  );

  return (
    <Dropdown
      placement="bottom-end"
      classNames={{
        content: "min-w-fit w-auto p-1",
      }}
    >
      <DropdownTrigger>
        <Button variant="bordered" className="uppercase rounded-[10px]">
          <Globe size={15} />
          {selectedValue}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection
        aria-label="Language options"
        selectedKeys={selectedKeys}
        selectionMode="single"
        onSelectionChange={setSelectedKeys}
        classNames={{
          base: "min-w-[80px] w-auto",
          list: "min-w-[80px] w-auto",
        }}
        itemClasses={{
          base: "min-w-[80px] w-auto px-2",
        }}
      >
        {SupportedLanguages.map((lang) => (
          <DropdownItem key={lang}>{lang.toUpperCase()}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
