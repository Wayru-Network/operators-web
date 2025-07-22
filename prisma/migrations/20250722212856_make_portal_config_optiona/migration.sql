-- DropForeignKey
ALTER TABLE "hotspot" DROP CONSTRAINT "hotspot_portal_config_id_fkey";

-- AlterTable
ALTER TABLE "hotspot" ALTER COLUMN "portal_config_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "hotspot" ADD CONSTRAINT "hotspot_portal_config_id_fkey" FOREIGN KEY ("portal_config_id") REFERENCES "portal_config"("id") ON DELETE SET NULL ON UPDATE CASCADE;
