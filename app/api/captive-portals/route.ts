import { NextResponse } from "next/server";
import { getSession } from "@/lib/session/session";
import getCaptivePortals from "./_services/get-captive-portals";

export async function GET() {
    const session = await getSession();
    if (!session.isLoggedIn || !session.accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const portals = await getCaptivePortals();


    return Response.json({ captivePortals: portals });
}