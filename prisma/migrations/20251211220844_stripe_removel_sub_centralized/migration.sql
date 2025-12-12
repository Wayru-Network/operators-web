/*
  Warnings:

  - You are about to drop the column `ad_asset_id` on the `asset` table. All the data in the column will be lost.
  - You are about to drop the column `portal_config_id` on the `asset` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_customer_id` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_subscription_id` on the `subscriptions` table. All the data in the column will be lost.
  - Added the required column `expiry_date` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AddonType" AS ENUM ('AD', 'VOUCHER', 'FORM');

-- DropForeignKey
ALTER TABLE "ad" DROP CONSTRAINT "ad_portal_config_id_fkey";

-- DropForeignKey
ALTER TABLE "companies" DROP CONSTRAINT "companies_customer_id_fkey";

-- DropIndex
DROP INDEX "subscriptions_stripe_subscription_id_key";

-- AlterTable
ALTER TABLE "asset" DROP COLUMN "ad_asset_id",
DROP COLUMN "portal_config_id";

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "stripe_customer_id";

-- AlterTable
ALTER TABLE "portal_config" ALTER COLUMN "ad_access" SET DEFAULT false,
ALTER COLUMN "voucher_access" SET DEFAULT false,
ALTER COLUMN "form_access" SET DEFAULT false,
ALTER COLUMN "redirect_url" DROP NOT NULL;

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "stripe_subscription_id",
ADD COLUMN     "expiry_date" TIMESTAMP(6) NOT NULL,
ALTER COLUMN "is_valid" SET DEFAULT true;

-- CreateTable
CREATE TABLE "subscription_addon" (
    "id" SERIAL NOT NULL,
    "subscription_id" INTEGER NOT NULL,
    "addon_type" "AddonType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscription_addon_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ad" ADD CONSTRAINT "ad_portal_config_id_fkey" FOREIGN KEY ("portal_config_id") REFERENCES "portal_config"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_addon" ADD CONSTRAINT "subscription_addon_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
