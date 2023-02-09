/*
  Warnings:

  - You are about to drop the column `examiningStructure` on the `HelpRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HelpRequest" DROP COLUMN "examiningStructure",
ADD COLUMN     "examiningOrganisation" TEXT,
ADD COLUMN     "prescribingOrganisation" TEXT;
