import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session/session";
import { verifyToken } from "@/app/api/auth/callback/_services/token-service";
import { getHotspots } from "@/app/[lang]/(operator)/hotspots/_services/get-hotspots";
import { searchHotspots } from "@/lib/services/search-hotspots";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session.isLoggedIn || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await verifyToken(session.accessToken);

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? "10");
  const query = searchParams.get("q")?.trim();

  if (query && query.length > 0) {
    const data = await searchHotspots(query, page, limit);
    return Response.json(data);
  }

  const data = await getHotspots(page, limit);
  return Response.json(data);
}
