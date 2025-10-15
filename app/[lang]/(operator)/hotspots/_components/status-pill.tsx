"use client";

export default function statusPill({
  status,
}: {
  status: "online" | "offline" | "unknown";
}) {
  const statusClasses = {
    online: "bg-secondary text-black",
    offline: "bg-primary text-white",
    unknown: "bg-gray-200 text-gray-700",
  };

  return (
    <span
      className={`flex justify-center items-center py-1 rounded-full text-sm font-medium capitalize ${
        statusClasses[status] || "bg-gray-200 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}
