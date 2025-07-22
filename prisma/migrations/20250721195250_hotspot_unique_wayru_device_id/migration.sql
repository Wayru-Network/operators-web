/*
  Warnings:

  - A unique constraint covering the columns `[wayru_device_id]` on the table `hotspot` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "hotspot_wayru_device_id_key" ON "hotspot"("wayru_device_id");
