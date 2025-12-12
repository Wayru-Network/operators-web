import { NextResponse } from "next/server";
import { getSession } from "@/lib/session/session";
import getCaptivePortals from "./_services/get-captive-portals";
import { canCreatePortal } from "@/app/[lang]/(operator)/captive-portal/new-portal/_services/can-create-portal";

export async function GET() {
  const session = await getSession();
  if (!session.isLoggedIn || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const portals = await getCaptivePortals();

  const canCreate = await canCreatePortal();

  return Response.json({ captivePortals: portals, canCreate: canCreate });
}
