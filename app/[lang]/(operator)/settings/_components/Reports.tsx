"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Download } from "lucide-react";

// Data example
const columns = [
  { key: "startDate", label: "Start Date", width: "120px" },
  { key: "endDate", label: "End Date", width: "120px" },
  { key: "emailsCollected", label: "Emails", width: "100px" },
  { key: "connections", label: "Connections", width: "100px" },
  { key: "dataUsed", label: "Data Used", width: "100px" },
  { key: "actions", label: "Actions", width: "80px" },
];

const Reports = () => {
  const data = [
    {
      startDate: "01/02/2025",
      endDate: "01/03/2025",
      emailsCollected: 100,
      connections: 100,
      dataUsed: "24 GB",
      actions: "download",
      id: 1,
    },
    {
      startDate: "01/03/2025",
      endDate: "01/04/2025",
      emailsCollected: 100,
      connections: 100,
      dataUsed: "24 GB",
      actions: "download",
      id: 2,
    },
    {
      startDate: "01/04/2025",
      endDate: "01/05/2025",
      emailsCollected: 100,
      connections: 100,
      dataUsed: "24 GB",
      actions: "download",
      id: 3,
    },
  ];

  const getKeyValue = (
    item: {
      startDate: string;
      endDate: string;
      emailsCollected: number;
      connections: number;
      dataUsed: string;
      actions: string;
      id: number;
    },
    key: keyof typeof item
  ) => {
    return item[key];
  };

  return (
    <div className="w-full overflow-hidden max-w-[900px]">
      <Table
        aria-label="Reports Table"
        classNames={{
          wrapper: "bg-transparent border-none shadow-none p-0",
          th: "bg-[#ffffff] dark:bg-[#191c1d] border-b-1 border-gray-200 dark:border-gray-700 px-4 pb-3 text-[14px] font-semibold text-gray-900 dark:text-white",
          td: "px-4 py-5",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              className="font-semibold"
              style={{ width: column.width }}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>

        <TableBody items={data} emptyContent="No reports found">
          {(item: {
            startDate: string;
            endDate: string;
            emailsCollected: number;
            connections: number;
            dataUsed: string;
            actions: string;
            id: number;
          }) => (
            <TableRow
              key={`${item.startDate}-${item.endDate}`}
              className="hover:bg-gray-100 dark:hover:bg-gray-500"
            >
              {(columnKey) => (
                <TableCell className="text-sm">
                  {columnKey === "actions" ? (
                    <button
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors cursor-pointer"
                      title="Download Report"
                    >
                      <Download size={16} />
                    </button>
                  ) : (
                    getKeyValue(item, columnKey as keyof typeof item)
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Reports;
