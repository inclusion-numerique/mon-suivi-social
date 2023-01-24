/*
  Warnings:

  - You are about to drop the column `agentId` on the `Beneficiary` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Beneficiary" DROP CONSTRAINT "Beneficiary_agentId_fkey";

-- AlterTable
ALTER TABLE "Beneficiary" DROP COLUMN "agentId";

-- CreateTable
CREATE TABLE "_beneficiary_referents" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_beneficiary_referents_AB_unique" ON "_beneficiary_referents"("A", "B");

-- CreateIndex
CREATE INDEX "_beneficiary_referents_B_index" ON "_beneficiary_referents"("B");

-- AddForeignKey
ALTER TABLE "_beneficiary_referents" ADD CONSTRAINT "_beneficiary_referents_A_fkey" FOREIGN KEY ("A") REFERENCES "Beneficiary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_beneficiary_referents" ADD CONSTRAINT "_beneficiary_referents_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
