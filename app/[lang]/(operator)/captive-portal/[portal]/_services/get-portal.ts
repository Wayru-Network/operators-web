"use server";
import { Prisma } from "@/lib/prisma-client/prisma";
import { getSession } from "@/lib/session/session";
import { PortalConfig } from "../_components/customize-captive-portal";
import { getBlobImage } from "./get-blob-image";

export default async function getPortal(portalId: number) {
  const { userId } = await getSession();
  const portal = await Prisma.portal_config.findFirst({
    where: {
      id: portalId,
      user_id: userId,
    },
    include: {
      logo: true,
      banner: true,
      ads: true,
    },
  });

  if (!portal) {
    return null;
  }

  const blobLogo = await getBlobImage(portal.logo.asset_url);
  const blobBanner = await getBlobImage(portal.banner.asset_url);

  if (!blobLogo.success) {
    blobLogo.url = "";
  }
  if (!blobBanner.success) {
    blobBanner.url = "";
  }

  const Config: PortalConfig = {
    colors: {
      background: portal?.background_color || "#ffffff",
      button: portal?.button_color || "#0070f3",
      text: portal?.text_color || "#000000",
    },
    logo: {
      url: blobLogo.url || null,
      file: null, // File will be handled in the component
    },
    banner: {
      url: blobBanner.url || null,
      file: null, // File will be handled in the component
    },
    ad: portal?.ad_access || false,
    voucher: portal?.voucher_access || false,
    userInfo: portal?.form_access || false,
    welcomeMessage: portal?.welcome_message || "",
    successMessage: portal?.success_message || "",
    ads: portal?.ads || [],
    redirectUrl: portal?.redirect_url || undefined,
    portalName: portal?.portal_name || "",
    assignedHotspot: [],
    adFormat: "video",
    adAsset: {
      url: null,
      file: null,
    },
    interactionTime: "15 Seconds",
  };
  return Config;
}
