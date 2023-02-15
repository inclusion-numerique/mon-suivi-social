/*
  Warnings:

  - The `pensionStructure` column on the `Beneficiary` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Beneficiary" DROP COLUMN "pensionStructure",
ADD COLUMN     "pensionStructure" TEXT[];
