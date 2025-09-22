-- AlterTable
ALTER TABLE "ad" ADD COLUMN     "customer_uuid" UUID;

-- AddForeignKey
ALTER TABLE "ad" ADD CONSTRAINT "ad_customer_uuid_fkey" FOREIGN KEY ("customer_uuid") REFERENCES "customers"("customer_uuid") ON DELETE SET NULL ON UPDATE CASCADE;
