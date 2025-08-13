import { NextResponse } from "next/server";
import { getSession } from "@/lib/session/session";
import { verifyToken } from "@/app/api/auth/callback/_services/token-service";
import { getHotspotBySubscription } from "@/app/api/hotspots/_services/hotspots-service";

export async function GET() {
    try {
        const session = await getSession();
        if (!session.isLoggedIn || !session.accessToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await verifyToken(session.accessToken);

        const hotspots = await getHotspotBySubscription();

        return NextResponse.json({ data: hotspots });
    } catch (error) {
        console.error('Error getting hotspots by subscription:', error);
        return NextResponse.json(
            { error: "Failed to get hotspots" },
            { status: 500 }
        );
    }
}
