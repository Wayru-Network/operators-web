/*
  Warnings:

  - You are about to drop the column `trial_end` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `trial_start` on the `subscriptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "trial_end",
DROP COLUMN "trial_start";
