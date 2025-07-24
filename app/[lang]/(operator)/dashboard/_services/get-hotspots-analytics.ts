"use server";
import { env } from "@/lib/infra/env";

export type Period = "last" | "3d" | "7d";
export interface HotspotAnalytics {
  error: {
    message: string;
  };
  data: {
    connectionsTotal: 0;
    trace: [];
    dataTrafficTotal: 0;
    dataTrafficTrace: [];
    unit: "KB";
  };
}
export interface HotspotsAnalyticsResponse {
  connectionsTotal: 0;
  trace: [];
  dataTrafficTotal: 0;
  dataTrafficTrace: [];
  unit: "KB";
}

export async function getHotspotsAnalytics(
  nasIds: string[],
  period: "last" | "3d" | "7d"
): Promise<HotspotsAnalyticsResponse> {

  const hotspotsData = await fetch(
    `${env.NAS_API_URL}/miner-dashboard?period=${period}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.NAS_API_KEY}`,
      },
      body: JSON.stringify({nasIds: nasIds}),
      method: "POST",
    }
  );

  let hotspots: HotspotAnalytics;
  try {
    hotspots = (await hotspotsData.json()) as HotspotAnalytics;
    if (!hotspots || hotspots?.error) {
      console.error(
        "API Error during hotspots analytics get:",
        hotspots.error.message
      );
      return {
        connectionsTotal: 0,
        trace: [],
        dataTrafficTotal: 0,
        dataTrafficTrace: [],
        unit: "KB",
      };
    }
  } catch (error) {
    console.error("Error fetching hotspots:", error);
    return {
      connectionsTotal: 0,
      trace: [],
      dataTrafficTotal: 0,
      dataTrafficTrace: [],
      unit: "KB",
    };
  }

  const {
    connectionsTotal,
    trace,
    dataTrafficTotal,
    dataTrafficTrace,
    unit,
  } = hotspots.data;

  return {
    connectionsTotal,
    trace,
    dataTrafficTotal,
    dataTrafficTrace,
    unit,
  };
}
