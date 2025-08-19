import { NextResponse } from "next/server";
import revokeSubscription from "./_services/revoke-subscription";
export async function POST(request: Request) {
  const { user_id, wayru_device_id } = await request.json();
  const revoke = await revokeSubscription({
    userId: user_id,
    wayru_device_id,
  });

  return NextResponse.json({
    success: revoke.success,
    message: revoke.message,
    error: revoke.error,
  });
}
