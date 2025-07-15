"use server";
import { PrismaClient } from "@/lib/generated/prisma";
import { getSession } from "@/lib/session/session";

const prisma = new PrismaClient();

export interface rowCaptivePortal {
  id: number;
  portal_name: string;
  flow_type: string;
  _count: {
    hotspots: number;
  };
}

export default async function getCaptivePortals(): Promise<rowCaptivePortal[]> {
  const session = await getSession();
  const rows = await prisma.portal_config.findMany({
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
    };
  });

  return transformedRows;
}
