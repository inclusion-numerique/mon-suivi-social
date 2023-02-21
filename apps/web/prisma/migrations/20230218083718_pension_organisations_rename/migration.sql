/*
  Warnings:

  - You are about to drop the column `pensionStructure` on the `Beneficiary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Beneficiary" DROP COLUMN "pensionStructure",
ADD COLUMN     "pensionOrganisations" TEXT[];
