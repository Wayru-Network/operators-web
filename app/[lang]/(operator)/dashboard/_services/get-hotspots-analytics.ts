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
  dataTrafficTotal: number;
  dataTrafficTrace: [];
  unit: "KB";
}

export async function getHotspotsAnalytics(
  nasIds: string[],
  period: "last" | "3d" | "7d"
): Promise<HotspotsAnalyticsResponse> {
  let hotspotsData;
  try {
    hotspotsData = await fetch(
      `${env.NAS_API_URL}/miner-dashboard?period=${period}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.NAS_API_KEY}`,
        },
        body: JSON.stringify({ nasIds: nasIds }),
        method: "POST",
      }
    );
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

  const { connectionsTotal, trace, dataTrafficTotal, dataTrafficTrace, unit } =
    hotspots.data;

  // format data traffic

  return {
    connectionsTotal,
    trace,
    dataTrafficTotal: bytesToReadableSize(dataTrafficTotal),
    dataTrafficTrace,
    unit,
  };
}

function bytesToReadableSize(bytes: number): number {
  const GB = 1024 ** 3
  const MB = 1024 ** 2
  const KB = 1024

  if (bytes >= GB) {
    return Number((bytes / GB).toFixed(2))
  } else if (bytes >= MB) {
    return Number((bytes / MB).toFixed(2))
  } else {
    return Number((bytes / KB).toFixed(2))
  }
}