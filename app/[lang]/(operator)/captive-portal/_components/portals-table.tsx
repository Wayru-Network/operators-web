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
import NewPortal from "./new-portal";
import { Search } from "lucide-react";
import PortalActions from "./portal-actions";
import { useCaptivePortals } from "@/lib/hooks/use-captive-portals";
import { Spinner } from "@heroui/react";

interface PortalsColumns {
  key: string;
  label: string;
  allowsSorting?: boolean;
}

interface PortalsRows {
  id: number | string;
  portal_name: string;
  flow_type: string;
  _count: {
    hotspots: number;
  };
  last_edit: string;
  conversion_rate?: string; // Optional, as it may not be present in all rows
}

export default function PortalsTable() {
  const { captivePortals: rows, isLoading } = useCaptivePortals();
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
      data = data.filter((r) => r["portal_name"].toLowerCase().includes(text));
    }

    if (sort.column && Array.isArray(data)) {
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
    { key: "portal_name", label: "Portal Name", allowsSorting: true },
    { key: "flow_type", label: "Flow Type" },
    {
      key: "assigned-hotspots",
      label: "Assigned Hotspots",
      allowsSorting: true,
    },
    //{ key: "conversion-rate", label: "Conversion Rate", allowsSorting: true },
    { key: "last_edit", label: "Last Edit", allowsSorting: true },
    { key: "actions", label: "Actions", allowsSorting: false },
  ];

  // Format last_edit date to MM-DD-YYYY and set timezone to user's locale
  rows.map((row) => {
    const date = new Date(row.last_edit);
    row.last_edit = date.toLocaleString(undefined, {
      year: "numeric",
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  });

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Type to search..."
          value={search}
          onValueChange={setSearch}
          radius="full"
          className="max-w-xs"
          classNames={{
            input: "!text-black dark:!text-white",
            inputWrapper: "pl-1 bg-[#E6E8E9] dark:bg-[#191c1d]",
            mainWrapper: "rounded-[30px]",
          }}
          startContent={<Search className="pl-2" />}
        />
        <NewPortal currentPortals={rows.length} />
      </div>

      <div className="bg-[#ffffff] dark:bg-[#191c1d] rounded-[30px] pb-8">
        <Table
          aria-label="Virtualized Paginated Table"
          isVirtualized
          isHeaderSticky
          rowHeight={40}
          maxTableHeight={rows.length > PAGE_SIZE ? 500 : 400} // when the rows are more than page size, we need to set the maxTableHeight to 500 to generate a smooth scroll, otherwise the table will be fixed height
          sortDescriptor={sort}
          onSortChange={setSort}
          classNames={{
            wrapper: "bg-transparent border-none shadow-none p-0",
            th: "bg-[#ffffff] dark:bg-[#191c1d] border-b-1 border-gray-200 dark:border-gray-700 text-center pt-8 pb-3 text-lg font-semibold text-gray-900 dark:text-white",
            td: "py-5",
          }}
        >
          <TableHeader columns={columns}>
            {(col: PortalsColumns) => (
              <TableColumn
                key={col.key}
                allowsSorting={col.allowsSorting}
                className="font-semibold text-[14px]"
              >
                {col.label}
              </TableColumn>
            )}
          </TableHeader>

          <TableBody
            items={paged}
            emptyContent={
              isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Spinner />
                </div>
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p>No portals found</p>
                </div>
              )
            }
          >
            {(item: PortalsRows) => (
              <TableRow
                key={item.id}
                className="hover:bg-gray-100 dark:hover:bg-gray-500"
              >
                {(columnKey) => (
                  <TableCell className="text-center">
                    {columnKey === "actions" ? (
                      <PortalActions portalId={item.id} />
                    ) : columnKey === "assigned-hotspots" ? (
                      <>{item._count.hotspots}</>
                    ) : columnKey === "conversion-rate" ? (
                      //@to-do: Implement conversion rate logic
                      <>{0 + "%"}</>
                    ) : columnKey === "portal_name" ? (
                      <a
                        href={`/captive-portal/${item.id}`}
                        className="flex items-center justify-center hover:underline"
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
        {pageCount > 1 && (
          <Pagination
            total={pageCount}
            page={page}
            onChange={setPage}
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
