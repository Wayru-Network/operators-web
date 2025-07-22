/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `hotspot` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "hotspot" ADD COLUMN     "name" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "hotspot_name_key" ON "hotspot"("name");
