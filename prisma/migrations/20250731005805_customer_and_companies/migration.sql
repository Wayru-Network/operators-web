-- CreateEnum
CREATE TYPE "industry_type" AS ENUM ('telecom', 'finance', 'technology');

-- CreateTable
CREATE TABLE "companies" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "tax_id" VARCHAR(100),
    "vat_number" VARCHAR(100),
    "industry" "industry_type" NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" SERIAL NOT NULL,
    "customer_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "full_name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "email" VARCHAR(150),

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_company_email_key" ON "companies"("email");

-- CreateIndex
CREATE UNIQUE INDEX "customers_customer_uuid_key" ON "customers"("customer_uuid");

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
