-- CreateEnum
CREATE TYPE "adFormat" AS ENUM ('static', 'gif', 'video');

-- CreateTable
CREATE TABLE "hotspot" (
    "id" SERIAL NOT NULL,
    "wayru_device_id" UUID NOT NULL,

    CONSTRAINT "hotspot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portalConfig" (
    "id" SERIAL NOT NULL,
    "hotspot_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "background_color" TEXT,
    "assetId" INTEGER NOT NULL,
    "redirect_url" TEXT NOT NULL,
    "hotspotId" INTEGER,

    CONSTRAINT "portalConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "networkConfig" (
    "id" SERIAL NOT NULL,
    "device_config_id" UUID NOT NULL,
    "device_config" JSONB NOT NULL,
    "hotspotId" INTEGER,

    CONSTRAINT "networkConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ad" (
    "id" SERIAL NOT NULL,
    "portal_config_id" INTEGER,
    "interaction_time" INTEGER NOT NULL,
    "ad_asset_id" INTEGER,
    "format" "adFormat" NOT NULL,
    "portalConfigId" INTEGER,

    CONSTRAINT "ad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset" (
    "id" SERIAL NOT NULL,
    "portal_config_id" INTEGER,
    "ad_asset_id" INTEGER,
    "asset_url" TEXT NOT NULL,

    CONSTRAINT "asset_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "portalConfig" ADD CONSTRAINT "portalConfig_logo_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portalConfig" ADD CONSTRAINT "portalConfig_banner_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portalConfig" ADD CONSTRAINT "portalConfig_hotspotId_fkey" FOREIGN KEY ("hotspotId") REFERENCES "hotspot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "networkConfig" ADD CONSTRAINT "networkConfig_hotspotId_fkey" FOREIGN KEY ("hotspotId") REFERENCES "hotspot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ad" ADD CONSTRAINT "ad_ad_asset_id_fkey" FOREIGN KEY ("ad_asset_id") REFERENCES "asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ad" ADD CONSTRAINT "ad_portalConfigId_fkey" FOREIGN KEY ("portalConfigId") REFERENCES "portalConfig"("id") ON DELETE SET NULL ON UPDATE CASCADE;
