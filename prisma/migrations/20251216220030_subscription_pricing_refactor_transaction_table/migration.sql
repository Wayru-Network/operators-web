/*
  Warnings:

  - You are about to drop the column `is_valid` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the `subscription_addon` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `base_price_cents` to the `subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plan_id` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PremiumFeatureType" AS ENUM ('AD', 'VOUCHER', 'FORM');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELED', 'EXPIRED', 'PAUSED');

-- CreateEnum
CREATE TYPE "SubscriptionTransactionType" AS ENUM ('PLAN_PURCHASE', 'PLAN_RENEWAL', 'PLAN_UPGRADE', 'PLAN_DOWNGRADE', 'PREMIUM_FEATURE_ADD', 'PREMIUM_FEATURE_REMOVE', 'TRIAL_START', 'TRIAL_END', 'SUBSCRIPTION_CANCELED', 'SUBSCRIPTION_REACTIVATED', 'MANUAL_ADJUSTMENT');

-- DropForeignKey
ALTER TABLE "subscription_addon" DROP CONSTRAINT "subscription_addon_subscription_id_fkey";

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "is_valid",
ADD COLUMN     "base_price_cents" INTEGER NOT NULL,
ADD COLUMN     "cancel_at_period_end" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canceled_at" TIMESTAMP(3),
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "is_trial" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "plan_id" INTEGER NOT NULL,
ADD COLUMN     "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "trial_ends_at" TIMESTAMP(3);

-- DropTable
DROP TABLE "subscription_addon";

-- DropEnum
DROP TYPE "AddonType";

-- CreateTable
CREATE TABLE "subscription_plan" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "base_price_cents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "premium_feature" (
    "id" SERIAL NOT NULL,
    "feature_type" "PremiumFeatureType" NOT NULL,
    "price_cents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "premium_feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_premium_feature" (
    "id" SERIAL NOT NULL,
    "subscription_id" INTEGER NOT NULL,
    "premium_feature_id" INTEGER NOT NULL,
    "price_cents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscription_premium_feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_transaction" (
    "id" SERIAL NOT NULL,
    "subscription_id" INTEGER NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "type" "SubscriptionTransactionType" NOT NULL,
    "amount_cents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscription_transaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "subscription_plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_premium_feature" ADD CONSTRAINT "subscription_premium_feature_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_premium_feature" ADD CONSTRAINT "subscription_premium_feature_premium_feature_id_fkey" FOREIGN KEY ("premium_feature_id") REFERENCES "premium_feature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_transaction" ADD CONSTRAINT "subscription_transaction_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_transaction" ADD CONSTRAINT "subscription_transaction_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
