/*
  Warnings:

  - You are about to drop the column `success_message` on the `portal_config` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "portal_config" DROP COLUMN "success_message",
ADD COLUMN     "button_text_color" TEXT;
