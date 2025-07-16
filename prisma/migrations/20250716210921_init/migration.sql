-- CreateEnum
CREATE TYPE "adFormat" AS ENUM ('static', 'gif', 'video');

-- CreateTable
CREATE TABLE "hotspot" (
    "id" SERIAL NOT NULL,
    "wayru_device_id" UUID NOT NULL,

    CONSTRAINT "hotspot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_config" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "portal_name" TEXT NOT NULL,
    "welcome_message" TEXT,
    "success_message" TEXT,
    "background_color" TEXT,
    "text_color" TEXT,
    "button_color" TEXT,
    "logo_asset_id" INTEGER NOT NULL,
    "banner_asset_id" INTEGER NOT NULL,
    "ad_access" BOOLEAN NOT NULL,
    "voucher_access" BOOLEAN NOT NULL,
    "form_access" BOOLEAN NOT NULL,
    "redirect_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portal_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "network_config" (
    "id" SERIAL NOT NULL,
    "device_config_id" UUID NOT NULL,
    "device_config" JSONB NOT NULL,
    "hotspot_id" INTEGER,

    CONSTRAINT "network_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ad" (
    "id" SERIAL NOT NULL,
    "portal_config_id" INTEGER,
    "interaction_time" INTEGER NOT NULL,
    "ad_asset_id" INTEGER,
    "format" "adFormat" NOT NULL,

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

-- CreateTable
CREATE TABLE "_portal_hotspots" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_portal_hotspots_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_portal_hotspots_B_index" ON "_portal_hotspots"("B");

-- AddForeignKey
ALTER TABLE "portal_config" ADD CONSTRAINT "portal_config_logo_asset_id_fkey" FOREIGN KEY ("logo_asset_id") REFERENCES "asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_config" ADD CONSTRAINT "portal_config_banner_asset_id_fkey" FOREIGN KEY ("banner_asset_id") REFERENCES "asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "network_config" ADD CONSTRAINT "network_config_hotspot_id_fkey" FOREIGN KEY ("hotspot_id") REFERENCES "hotspot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ad" ADD CONSTRAINT "ad_ad_asset_id_fkey" FOREIGN KEY ("ad_asset_id") REFERENCES "asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ad" ADD CONSTRAINT "ad_portal_config_id_fkey" FOREIGN KEY ("portal_config_id") REFERENCES "portal_config"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_portal_hotspots" ADD CONSTRAINT "_portal_hotspots_A_fkey" FOREIGN KEY ("A") REFERENCES "hotspot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_portal_hotspots" ADD CONSTRAINT "_portal_hotspots_B_fkey" FOREIGN KEY ("B") REFERENCES "portal_config"("id") ON DELETE CASCADE ON UPDATE CASCADE;
