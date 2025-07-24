"use client";
import React, { useState, useEffect } from "react";
import { getHotspots } from "../../hotspots/_services/get-hotspots";
import { getHotspotsAnalytics, Period } from "../_services/get-hotspots-analytics";
import AnalyticCard from "./analytic-card";
import PeriodPicker from "@/lib/components/periodPicker";

export default function DashboardContent() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("last");
  const [analytics, setAnalytics] = useState({
    totalHotspots: 0,
    connections: 0,
    dataTraffic: 0,
    unit: "KB",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const fetchAnalytics = async (period: Period) => {
    setIsLoading(true);
    try {
      
      const hotspots = await getHotspots(1, 2);
      const nasIds = hotspots.data.map((hotspot) => hotspot.mac);
      const hotspotsAnalytics = await getHotspotsAnalytics(nasIds, period);

      setAnalytics({
        totalHotspots: hotspots?.meta?.total ?? 0,
        connections: hotspotsAnalytics?.connectionsTotal ?? 0,
        dataTraffic: hotspotsAnalytics?.dataTrafficTotal ?? 0,
        unit: hotspotsAnalytics?.unit ?? "KB",
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setIsLoading(false);
      if (isFirstLoad) {
        setIsFirstLoad(false);
        return;
      }
    }
  };

  useEffect(() => {
    fetchAnalytics(selectedPeriod);
  }, [selectedPeriod]);

  const handlePeriodChange = (period: Period) => {
    setSelectedPeriod(period);
  };

  return (
    <div>
      <div className="mt-3 mb-4">
        <PeriodPicker
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
        />
      </div>
      <div className="w-full h-full bg-[#ffffff] dark:bg-[#191c1d] rounded-[30px] my-2 p-10">
        <p className="text-base font-semibold">General Analytics</p>
        <div className="flex gap-2 mt-8">
          <AnalyticCard
            title="Hotspots"
            value={analytics.totalHotspots.toString()}
            isLoadingValue={isLoading && isFirstLoad}
          />
          <AnalyticCard
            title="Data traffic"
            value={analytics.dataTraffic.toString()}
            isLoadingValue={isLoading}
            unit={analytics.unit}
          />
          <AnalyticCard
            title="Connections"
            value={analytics.connections.toString()}
            isLoadingValue={isLoading}
          />
        </div>
        <div className="flex gap-2 mt-18 flex-col">
          <p className="text-base font-semibold">Captive portal analytics</p>
          <p className="text-base font-medium">Soon</p>
        </div>
      </div>
    </div>
  );
}
