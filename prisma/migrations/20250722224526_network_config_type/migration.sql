/*
  Warnings:

  - Added the required column `type` to the `network_config` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "networkConfigType" AS ENUM ('open', 'private');

-- AlterTable
ALTER TABLE "network_config" ADD COLUMN     "type" "networkConfigType" NOT NULL;
