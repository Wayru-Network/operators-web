import React from "react";

export default function PlanNotFound() {
  return (
    <div className="flex flex-col gap-3 items-center w-full justify-center mt-10">
      <p className="text-2xl font-normal">Plans not found</p>
      <p className="text-sm text-gray-500">Please try again later.</p>
    </div>
  );
}
