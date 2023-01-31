/*
  Warnings:

  - You are about to drop the column `source` on the `MutationLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MutationLog" DROP COLUMN "source",
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;
