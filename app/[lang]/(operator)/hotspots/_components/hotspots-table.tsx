"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  getKeyValue,
  type SortDescriptor,
} from "@heroui/table";
import { Input } from "@heroui/input";
import { Pagination } from "@heroui/pagination";
import StatusPill from "@/app/[lang]/(operator)/hotspots/_components/status-pill";
import {
  Hotspot,
  MinersByAddressResponse,
} from "@/app/[lang]/(operator)/hotspots/_services/get-hotspots";
import { Settings } from "lucide-react";
import { redirect } from "next/navigation";
import { useHotspots } from "@/lib/hooks/use-hotspots";
import { Search } from "lucide-react";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";

interface HotspotColumns {
  key: string;
  label: string;
  allowsSorting?: boolean;
}

export default function HotspotsTable({
  rows,
  initialMeta,
}: {
  rows: Hotspot[];
  initialMeta: MinersByAddressResponse["meta"];
}) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 400);
  const [sort, setSort] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });

  const PAGE_SIZE = 6; // row limit per page
  const [page, setPage] = useState(1);

  const { hotspots, meta, isLoading } = useHotspots(
    initialMeta.page,
    PAGE_SIZE,
    debouncedSearch,
    {
      data: rows,
      meta: initialMeta,
    }
  );

  // filter and sort logic
  const filtered = useMemo(() => {
    let data = hotspots;

    if (sort.column) {
      data = [...data].sort((a, b) => {
        const aVal = getKeyValue(a, sort.column!);
        const bVal = getKeyValue(b, sort.column!);
        const res = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        return sort.direction === "ascending" ? res : -res;
      });
    }
    return data;
  }, [sort, hotspots]);

  // pagination logic
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    if (page > pageCount) setPage(1);
  }, [page, pageCount]);

  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const columns: HotspotColumns[] = [
    { key: "name", label: "Hotspot Name", allowsSorting: true },
    { key: "mac", label: "MAC" },
    { key: "status", label: "Status" },
    { key: "assigned_portal", label: "Assigned Portal" },
    { key: "location_name", label: "Location Name" },
    { key: "actions", label: "Actions", allowsSorting: false },
  ];

  const goto = useCallback(
    (page: number) => {
      setPage(page + 1);
      redirect(`/hotspots?page=${page}`);
    },
    [setPage]
  );

  return (
    <div className="flex flex-col space-y-4">
      <Input
        placeholder="Type to search..."
        value={search}
        onValueChange={setSearch}
        className="max-w-xs"
        classNames={{
          input:
            "bg-[#ffffff] dark:bg-[#191c1d] rounded-[28px] dark:text-white disabled:placeholder:text-gray-400 dark:disabled:placeholder:text-gray-600",
          inputWrapper: "p-0",
        }}
        startContent={<Search className="pl-2" />}
      />
      <div className="bg-[#ffffff] dark:bg-[#191c1d] rounded-[30px] pb-8">
        <Table
          aria-label="Virtualized Paginated Table"
          isVirtualized
          isHeaderSticky
          rowHeight={40}
          sortDescriptor={sort}
          onSortChange={setSort}
          classNames={{
            wrapper: "bg-transparent border-none shadow-none p-0",
            th: "bg-[#ffffff] dark:bg-[#191c1d] border-b-1 border-gray-200 dark:border-gray-700 px-4 pt-8 pb-3 text-[14px] font-semibold text-gray-900 dark:text-white",
            td: "px-4 py-5",
          }}
        >
          <TableHeader columns={columns}>
            {(col: HotspotColumns) => (
              <TableColumn
                key={col.key}
                allowsSorting={col.allowsSorting}
                className="font-semibold"
              >
                {col.label}
              </TableColumn>
            )}
          </TableHeader>

          <TableBody
            items={paged}
            emptyContent="No hotspots found"
            isLoading={isLoading}
          >
            {(item: Hotspot) => (
              <TableRow
                key={item.name}
                className="hover:bg-gray-100 dark:hover:bg-gray-500"
              >
                {(columnKey) => (
                  <TableCell>
                    {columnKey === "status" ? (
                      <StatusPill
                        status={
                          getKeyValue(item, columnKey) as
                            | "online"
                            | "offline"
                            | "unknown"
                        }
                      />
                    ) : columnKey === "actions" ? (
                      <a href={`/hotspots/${item.name}`} className="block">
                        <Settings />
                      </a>
                    ) : columnKey === "name" ? (
                      <a
                        href={`/hotspots/${item.name}`}
                        className="hover:underline"
                      >
                        {getKeyValue(item, columnKey)}
                      </a>
                    ) : columnKey === "assigned-portal" ? (
                      <a
                        href={`/captive-portal/${item.assigned_portal}`}
                        className="hover:underline"
                      >
                        {getKeyValue(item, columnKey)}
                      </a>
                    ) : (
                      getKeyValue(item, columnKey)
                    )}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
        {meta && meta.pages > 1 && (
          <Pagination
            total={meta.pages}
            page={meta.page}
            onChange={goto}
            showControls
            className="flex justify-center"
            classNames={{
              item: "dark:text-white text-black",
              prev: "dark:text-white text-black",
              next: "dark:text-white text-black",
            }}
          />
        )}
      </div>
    </div>
  );
}
