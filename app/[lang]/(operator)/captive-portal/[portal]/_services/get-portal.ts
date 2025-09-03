"use server";
import { Prisma } from "@/lib/infra/prisma";
import { getSession } from "@/lib/session/session";
import { PortalConfig } from "../_components/customize-captive-portal";
import { getBlobImage } from "@/lib/blob_storage/get-blob-image";

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
      ads: {
        select: {
          id: true,
          asset: {
            select: {
              ad_asset_id: true,
              asset_url: true,
            },
          },
          format: true,
          interaction_time: true,
        },
      },
      hotspots: {
        select: {
          id: true,
          name: true,
          wayru_device_id: true,
        },
      },
    },
  });

  if (!portal) {
    return null;
  }

  const blobLogo = await getBlobImage(portal.logo.asset_url);
  const blobBanner = await getBlobImage(portal.banner.asset_url);
  let blobAd = null;
  if (portal.ads.length > 0 && portal.ads[0].asset) {
    blobAd = await getBlobImage(portal.ads[0].asset.asset_url);
  }

  if (!blobLogo.success) {
    blobLogo.url = "";
  }
  if (!blobBanner.success) {
    blobBanner.url = "";
  }

  let adFormat = null;
  if (portal.ads.length > 0) {
    adFormat = portal.ads[0].format;
  }

  let adInteractionTime = "15";
  if (portal.ads.length > 0) {
    adInteractionTime = portal.ads[0].interaction_time.toString();
  }

  let adName = null;
  if (portal.ads.length > 0) {
    adName = portal.ads[0].asset?.asset_url;
  }

  const Config: PortalConfig = {
    id: portal.id,
    userId: portal.user_id,
    colors: {
      background: portal?.background_color || "#ffffff",
      button: portal?.button_color || "#0070f3",
      text: portal?.text_color || "#000000",
      buttonText: portal?.button_text_color || "#ffffff",
    },
    logo: {
      url: blobLogo.url || null,
      file: null, // File will be handled in the component
      name: portal.logo.asset_url,
    },
    banner: {
      url: blobBanner.url || null,
      file: null, // File will be handled in the component
      name: portal.banner.asset_url,
    },
    ad: portal?.ad_access || false,
    voucher: portal?.voucher_access || false,
    userInfo: portal?.form_access || false,
    welcomeMessage: portal?.welcome_message || "",
    ads: portal?.ads || [],
    redirectUrl: portal?.redirect_url || "",
    portalName: portal?.portal_name || "",
    assignedHotspot: portal.hotspots.map((h) => ({
      id: h.id,
      wayru_device_id: h.wayru_device_id,
      name: h.name ?? "",
      mac: "",
      latitude: "",
      longitude: "",
      solana_asset_id: "",
      nfnode_type: "",
      status: "unknown",
    })),
    adFormat: adFormat || "video",
    adAsset: {
      url: blobAd?.url || null,
      file: null,
      name: adName || null,
    },
    interactionTime: adInteractionTime || "15",
  };

  return Config;
}
