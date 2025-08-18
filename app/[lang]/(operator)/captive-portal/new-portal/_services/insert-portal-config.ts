import { NewPortalConfig } from "../_components/create-captive-portal";
import { PrismaClient } from "@prisma/client/extension";

export async function insertPortalConfig(
  config: NewPortalConfig,
  userId: string,
  logoId: number,
  bannerId: number,
  tx: PrismaClient
) {
  const existing = await tx.portal_config.findFirst({
    where: {
      user_id: userId,
      portal_name: config.portalName,
    },
  });

  if (existing) {
    return {
      success: false,
      error: "You already have a portal with this name.",
    };
  }

  const portal = await tx.portal_config.create({
    data: {
      user_id: userId,
      portal_name: config.portalName,
      welcome_message: config.welcomeMessage,
      logo: { connect: { id: logoId } },
      banner: { connect: { id: bannerId } },
      redirect_url: config.redirectUrl || "",
      background_color: config.colors.background,
      text_color: config.colors.text,
      button_color: config.colors.button,
      button_text_color: config.colors.buttonText,
      ad_access: config.ad,
      voucher_access: config.voucher,
      form_access: config.userInfo,
    },
  });

  return { success: true, portal };
}
