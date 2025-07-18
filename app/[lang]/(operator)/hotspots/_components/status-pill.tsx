"use client";

export default function statusPill({
  status,
}: {
  status: "active" | "inactive";
}) {
  const statusClasses = {
    active: "bg-secondary text-black",
    inactive: "bg-primary text-white",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${
        statusClasses[status] || "bg-gray-200 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}
