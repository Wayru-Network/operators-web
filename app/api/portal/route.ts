import { Prisma } from "@/lib/infra/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const deviceId = url.searchParams.get("device_id");

  if (!deviceId) {
    return new Response("Missing device_id", { status: 400 });
  }

  const portalConfig = await Prisma.portal_config.findFirst({
    where: {
      hotspots: {
        some: {
          wayru_device_id: deviceId,
        },
      },
    },
    select: {
      portal_name: true,
      welcome_message: true,
      background_color: true,
      text_color: true,
      button_color: true,
      button_text_color: true,
      logo_asset_id: true,
      banner_asset_id: true,
      ad_access: true,
      form_access: true,
      voucher_access: true,
      redirect_url: true,
      ads: {
        select: {
          asset: {
            select: {
              id: true,
            },
          },
          format: true,
          interaction_time: true,
        },
      },
    },
  });

  if (!portalConfig) {
    return new Response("Portal not found", { status: 404 });
  }

  const logoAsset = Prisma.asset.findFirst({
    where: {
      id: portalConfig?.logo_asset_id,
    },
    select: {
      asset_url: true,
    },
  });

  const bannerAsset = Prisma.asset.findFirst({
    where: {
      id: portalConfig?.banner_asset_id,
    },
    select: {
      asset_url: true,
    },
  });

  const ads = portalConfig?.ads.map(async (ad) => {
    const asset = await Prisma.asset.findFirst({
      where: {
        id: ad.asset?.id,
      },
      select: {
        asset_url: true,
      },
    });
    return {
      id: ad.asset?.id ?? 0,
      portal_config_id: portalConfig?.portal_name ?? "",
      ad_asset_id: ad.asset?.id ?? 0,
      format: ad.format,
      interaction_time: ad.interaction_time,
      asset_url: asset?.asset_url,
    };
  });

  const adsResolved = await Promise.all(ads ?? []);
  const result = {
    portal_name: portalConfig.portal_name,
    welcome_message: portalConfig.welcome_message,
    background_color: portalConfig.background_color,
    text_color: portalConfig.text_color,
    button_color: portalConfig.button_color,
    button_text_color: portalConfig.button_text_color,
    logo_asset_url: (await logoAsset)?.asset_url ?? null,
    banner_asset_url: (await bannerAsset)?.asset_url ?? null,
    ad_access: portalConfig.ad_access,
    form_access: portalConfig.form_access,
    voucher_access: portalConfig.voucher_access,
    redirect_url: portalConfig.redirect_url,
    ads: adsResolved,
  };

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
