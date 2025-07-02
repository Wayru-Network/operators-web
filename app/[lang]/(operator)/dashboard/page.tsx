import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Wayru",
};

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-normal">Dashboard</h1>
      <div className="w-full h-full bg-[#ffffff] dark:bg-[#191c1d] rounded-[30px] my-2 p-10">
        <p>General Analytics</p>
      </div>
    </div>
  );
}
