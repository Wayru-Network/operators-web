"use client";

export default function statusPill({
  status,
}: {
  status: "Online" | "Offline";
}) {
  const statusClasses = {
    Online: "bg-secondary text-black",
    Offline: "bg-primary text-white",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        statusClasses[status] || "bg-gray-200 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}
