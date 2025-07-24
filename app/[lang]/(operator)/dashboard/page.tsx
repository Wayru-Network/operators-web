import { Metadata } from "next";
import DashboardContent from "./_components/DashboardContent";

export const metadata: Metadata = {
  title: "Dashboard - Wayru",
};

export default async function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-normal">Dashboard</h1>
      <DashboardContent />
    </div>
  );
}
