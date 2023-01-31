/*
  Warnings:

  - You are about to drop the column `aggregateId` on the `MutationLog` table. All the data in the column will be lost.
  - Added the required column `name` to the `MutationLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MutationLog" DROP COLUMN "aggregateId",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "targetBeneficiaryId" UUID,
ADD COLUMN     "targetId" TEXT,
ADD COLUMN     "targetStructureId" UUID,
ADD COLUMN     "targetUserId" UUID;

-- AddForeignKey
ALTER TABLE "MutationLog" ADD CONSTRAINT "MutationLog_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MutationLog" ADD CONSTRAINT "MutationLog_targetStructureId_fkey" FOREIGN KEY ("targetStructureId") REFERENCES "Structure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MutationLog" ADD CONSTRAINT "MutationLog_targetBeneficiaryId_fkey" FOREIGN KEY ("targetBeneficiaryId") REFERENCES "Beneficiary"("id") ON DELETE SET NULL ON UPDATE CASCADE;
