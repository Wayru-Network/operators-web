/*
  Warnings:

  - Added the required column `hotspot_limit` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "hotspot_limit" INTEGER NOT NULL;
