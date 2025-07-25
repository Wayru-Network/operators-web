"use client";

import { Skeleton } from "@heroui/react";
import { Wifi } from "lucide-react";

export default function AnalyticCard({
  title,
  value,
  isLoadingValue = false,
  unit,
}: {
  title: string;
  value: string;
  isLoadingValue?: boolean;
  unit?: string;
}) {
  return (
    <div className="flex gap-2 items-start justify-between w-1/3 px-12">
      <div className="flex flex-col">
        <p className="text-base font-medium">{title}</p>
        <div className="flex items-end gap-1">
            {
                isLoadingValue ? (
                    <Skeleton className="w-6 h-9 rounded-md" />
                ) : (
                    <p className="text-4xl font-semibold">{value}</p>
                )
            }
          {unit && <p className="text-4xl font-semibold">{unit}</p>}
        </div>
      </div>
      <Wifi
        width={20}
        height={14.88}
        className="text-[#000000] dark:text-[#ffffff]"
      />
    </div>
  );
}
