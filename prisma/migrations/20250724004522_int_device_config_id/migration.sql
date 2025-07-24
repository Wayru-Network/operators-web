/*
  Warnings:

  - Changed the type of `device_config_id` on the `network_config` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "network_config" DROP COLUMN "device_config_id",
ADD COLUMN     "device_config_id" INTEGER NOT NULL;
