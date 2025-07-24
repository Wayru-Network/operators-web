"use client";
import React from "react";
import { Period } from "@/app/[lang]/(operator)/dashboard/_services/get-hotspots-analytics";
import { redirect } from "next/navigation";

interface PeriodPickerProps {
  currentPeriod: Period;
}

export default function PeriodPicker({ currentPeriod }: PeriodPickerProps) {
  const Period = ({ period, label }: { period: Period, label?: string }) => {
    const isSelected = period === currentPeriod;
    
  const goto = (period: Period) => {
    redirect(`?period=${period}`);
  }
    
    return (
      <div 
        className={`
          rounded-full px-4 py-1.5 cursor-pointer transition-all duration-200 border-1 border-gray-200 dark:border-gray-500
          ${isSelected 
            ? 'bg-gray-200 dark:bg-[#191c1d] ' 
            : 'text-gray-600 hover:bg-gray-200 dark:hover:bg-[#191c1d]'
          }
        `}
        onClick={() => goto(period)}
      >
        <p className={`text-xs ${isSelected ? 'font-medium dark:text-white' : 'font-normal dark:text-white'}`}>
          {label || period}
        </p>
      </div>
    )
  }


  return (
    <div className="flex items-center justify-between gap-2 max-w-[280px]">
      <Period period="last" label="Last" />
      <Period period="3d" label="Last 3 days" />
      <Period period="7d" label="Last 7 days" />
    </div>
  );
}
