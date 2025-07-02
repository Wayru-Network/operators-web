"use client";

import React, { useMemo, useState, useEffect } from "react";
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
import Image from "next/image";
import StatusPill from "@/app/[lang]/(operator)/hotspots/_components/status-pill";
import getHotspots from "@/app/[lang]/(operator)/hotspots/_services/get-hotspots";

export default function HotspotsTable() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    getHotspots().then((data) => setRows(data));
  }, []);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });
  const PAGE_SIZE = 6; // row limit per page
  const [page, setPage] = useState(1);

  // filter and sort logic
  const filtered = useMemo(() => {
    const text = search.trim().toLowerCase();
    let data = rows;

    if (text) {
      data = data.filter((r) => r["hotspot-name"].toLowerCase().includes(text));
    }

    if (sort.column) {
      data = [...data].sort((a, b) => {
        const aVal = getKeyValue(a, sort.column!);
        const bVal = getKeyValue(b, sort.column!);
        const res = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        return sort.direction === "ascending" ? res : -res;
      });
    }
    return data;
  }, [rows, search, sort]);

  // pagination logic
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    if (page > pageCount) setPage(1);
  }, [page, pageCount]);

  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const columns = [
    { key: "hotspot-name", label: "Hotspot Name", allowsSorting: true },
    { key: "mac", label: "MAC" },
    { key: "status", label: "Status" },
    { key: "assigned-portal", label: "Assigned Portal" },
    { key: "location-name", label: "Location Name" },
    { key: "actions", label: "Actions", allowsSorting: false },
  ];

  return (
    <div className="flex flex-col space-y-4">
      <Input
        placeholder="Type to search..."
        value={search}
        onValueChange={setSearch}
        className="max-w-xs"
        classNames={{
          input:
            "bg-[#ffffff] dark:bg-[#191c1d] rounded-[28px] dark:text-white",
          inputWrapper: "p-0",
        }}
        startContent={
          <Image
            src="/assets/search.svg"
            alt="Search icon"
            width={48}
            height={48}
            className="dark:invert"
          />
        }
      />

      <div className="bg-[#ffffff] dark:bg-[#191c1d] rounded-[30px] pb-8">
        <Table
          aria-label="Virtualized Paginated Table"
          isVirtualized
          isHeaderSticky
          rowHeight={40}
          maxTableHeight={500}
          sortDescriptor={sort}
          onSortChange={setSort}
          classNames={{
            wrapper: "bg-transparent border-none shadow-none p-0",
            th: "bg-[#ffffff] dark:bg-[#191c1d] border-b-1 border-gray-200 dark:border-gray-700 px-10 pt-8 pb-3 text-lg font-semibold text-gray-900 dark:text-white",
            td: "px-10 py-2",
          }}
        >
          <TableHeader columns={columns}>
            {(col) => (
              <TableColumn
                key={col.key}
                allowsSorting={col.allowsSorting}
                className="font-semibold"
              >
                {col.label}
              </TableColumn>
            )}
          </TableHeader>

          <TableBody items={paged}>
            {(item) => (
              <TableRow
                key={item.key}
                className="hover:bg-gray-100 dark:hover:bg-gray-500"
              >
                {(columnKey) => (
                  <TableCell>
                    {columnKey === "status" ? (
                      <StatusPill
                        status={
                          getKeyValue(item, columnKey) as "Online" | "Offline"
                        }
                      />
                    ) : columnKey === "actions" ? (
                      <a
                        href={`/captive-portal/${item["assigned-portal"]}`}
                        className="block"
                      >
                        <Image
                          src="/assets/cog.svg"
                          alt="Settings icon"
                          width={48}
                          height={48}
                          className="dark:invert"
                        />
                      </a>
                    ) : columnKey === "hotspot-name" ? (
                      <a
                        href={`/hotspots/${item["hotspot-name"]}`}
                        className="hover:underline"
                      >
                        {getKeyValue(item, columnKey)}
                      </a>
                    ) : columnKey === "assigned-portal" ? (
                      <a
                        href={`/captive-portal/${item["assigned-portal"]}`}
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
        <Pagination
          total={pageCount}
          page={page}
          onChange={setPage}
          showControls
          className="flex justify-center pt-5"
          classNames={{
            item: "dark:text-white",
            prev: "dark:text-white",
            next: "dark:text-white",
          }}
        />
      </div>
    </div>
  );
}
