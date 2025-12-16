import { Prisma } from "@/lib/infra/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const deviceId = url.searchParams.get("device_id");

  if (!deviceId) {
    return new Response("Missing device_id", { status: 400 });
  }

  const hotspot = await Prisma.hotspot.findFirst({
    where: { wayru_device_id: deviceId },
    include: {
      subscription: true,
      portal_config: {
        include: {
          ads: {
            select: {
              id: true,
              format: true,
              interaction_time: true,
              asset: { select: { id: true, asset_url: true } },
            },
          },
        },
      },
    },
  });

  if (!hotspot) {
    return new Response("Hotspot not found", { status: 404 });
  }

  // Check subscription validity
  let valid_sub: boolean;
  if (!hotspot.subscription) {
    valid_sub = false;
  } else {
    valid_sub = hotspot.subscription?.status == "ACTIVE" ? true : false;
  }

  const portalConfig = hotspot.portal_config;
  if (!portalConfig) {
    return new Response("Portal config not found", { status: 404 });
  }

  // Get assets in parallel
  const [logoAsset, bannerAsset] = await Promise.all([
    Prisma.asset.findFirst({
      where: { id: portalConfig.logo_asset_id },
      select: { asset_url: true },
    }),
    Prisma.asset.findFirst({
      where: { id: portalConfig.banner_asset_id },
      select: { asset_url: true },
    }),
  ]);

  // Get Ads assets in parallel
  const ads = portalConfig.ads.map(async (ad) => {
    const asset = await Prisma.asset.findFirst({
      where: { id: ad.asset?.id },
      select: { asset_url: true },
    });
    return {
      id: ad.asset?.id ?? 0,
      portal_config_id: portalConfig.portal_name ?? "",
      ad_asset_id: ad.asset?.id ?? 0,
      format: ad.format,
      interaction_time: ad.interaction_time,
      asset_url: asset?.asset_url,
    };
  });

  const adsResolved = await Promise.all(ads ?? []);

  // Build the final response
  const result = {
    portal_name: portalConfig.portal_name,
    welcome_message: portalConfig.welcome_message,
    background_color: portalConfig.background_color,
    text_color: portalConfig.text_color,
    button_color: portalConfig.button_color,
    button_text_color: portalConfig.button_text_color,
    logo_asset_url: logoAsset?.asset_url ?? null,
    banner_asset_url: bannerAsset?.asset_url ?? null,
    ad_access: portalConfig.ad_access,
    form_access: portalConfig.form_access,
    voucher_access: portalConfig.voucher_access,
    redirect_url: portalConfig.redirect_url,
    ads: adsResolved,
    valid_subscription: valid_sub,
  };

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
