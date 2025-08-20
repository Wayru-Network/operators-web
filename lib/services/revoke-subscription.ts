import { Prisma } from "@/lib/infra/prisma";

interface revokeProps {
  userId: string;
  wayru_device_id: string;
}

interface revokeResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export default async function revokeSubscription({
  userId,
  wayru_device_id,
}: revokeProps): Promise<revokeResponse> {
  console.log("Revoking subscription for user:", userId);
  console.log("Revoking subscription for device:", wayru_device_id);
  try {
    await Prisma.hotspot.update({
      where: { wayru_device_id: wayru_device_id },
      data: {
        location_name: "Unkown",
        portal_config: {
          disconnect: true,
        },
        subscription: {
          disconnect: true,
        },
      },
    });
  } catch (error) {
    console.error("Error revoking subscription:", error);
    return { success: false, error: `Failed to revoke subscription: ${error}` };
  }

  return { success: true, message: "Subscription revoked successfully" };
}
