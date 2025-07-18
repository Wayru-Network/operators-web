"use server";
import { getSession } from "@/lib/session/session";
import { Prisma } from "@/lib/infra/prisma";

export interface rowCaptivePortal {
  id: number;
  portal_name: string;
  flow_type: string;
  _count: {
    hotspots: number;
  };
  last_edit: string;
}

export default async function getCaptivePortals(): Promise<rowCaptivePortal[]> {
  const session = await getSession();
  console.log("Session:", session.userId);
  const rows = await Prisma.portal_config.findMany({
    orderBy: {
      portal_name: "asc",
    },
    select: {
      id: true,
      portal_name: true,
      ad_access: true,
      voucher_access: true,
      form_access: true,
      _count: {
        select: {
          hotspots: true,
        },
      },
      updated_at: true,
    },
    where: {
      user_id: session?.userId,
    },
  });

  // Transform access type to flow type
  const transformedRows = rows.map((row) => {
    const flowTypes: string[] = [];
    if (row.ad_access) flowTypes.push("Ad");
    if (row.form_access) flowTypes.push("Form");
    if (row.voucher_access) flowTypes.push("Voucher");

    return {
      id: row.id,
      portal_name: row.portal_name,
      flow_type: flowTypes.join(", "),
      _count: row._count,
      last_edit: row.updated_at.toString(), // Ensure date is in ISO format
    };
  });

  return transformedRows;
}
