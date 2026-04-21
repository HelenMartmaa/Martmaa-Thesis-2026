/*
  Warnings:

  - You are about to drop the column `notes` on the `result_entries` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "result_entries" DROP COLUMN "notes",
ALTER COLUMN "numeric_value" DROP NOT NULL;
