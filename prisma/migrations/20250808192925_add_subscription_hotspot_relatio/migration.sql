-- AlterTable
ALTER TABLE "hotspot" ADD COLUMN     "subscription_id" INTEGER;

-- AlterTable
ALTER TABLE "subscriptions" ALTER COLUMN "stripe_subscription_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "hotspot" ADD CONSTRAINT "hotspot_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
