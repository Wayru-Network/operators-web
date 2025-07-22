/*
  Warnings:

  - You are about to drop the `_portal_hotspots` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `portal_config_id` to the `hotspot` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_portal_hotspots" DROP CONSTRAINT "_portal_hotspots_A_fkey";

-- DropForeignKey
ALTER TABLE "_portal_hotspots" DROP CONSTRAINT "_portal_hotspots_B_fkey";

-- AlterTable
ALTER TABLE "hotspot" ADD COLUMN     "portal_config_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_portal_hotspots";

-- AddForeignKey
ALTER TABLE "hotspot" ADD CONSTRAINT "hotspot_portal_config_id_fkey" FOREIGN KEY ("portal_config_id") REFERENCES "portal_config"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
