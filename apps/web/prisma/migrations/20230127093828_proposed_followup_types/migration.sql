/*
  Warnings:

  - You are about to drop the column `type` on the `FollowupType` table. All the data in the column will be lost.
  - You are about to drop the `_FollowupTypeToOrganisation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_FollowupTypeToOrganisation" DROP CONSTRAINT "_FollowupTypeToOrganisation_A_fkey";

-- DropForeignKey
ALTER TABLE "_FollowupTypeToOrganisation" DROP CONSTRAINT "_FollowupTypeToOrganisation_B_fkey";

-- AlterTable
ALTER TABLE "FollowupType" DROP COLUMN "type",
ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdById" UUID,
ADD COLUMN     "legallyRequired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "organisationId" UUID;

-- DropTable
DROP TABLE "_FollowupTypeToOrganisation";

-- DropEnum
DROP TYPE "FollowupTypeType";

-- CreateTable
CREATE TABLE "ProposedFollowupType" (
    "organisationId" UUID NOT NULL,
    "followupTypeId" UUID NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProposedFollowupType_pkey" PRIMARY KEY ("organisationId","followupTypeId")
);

-- AddForeignKey
ALTER TABLE "FollowupType" ADD CONSTRAINT "FollowupType_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowupType" ADD CONSTRAINT "FollowupType_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposedFollowupType" ADD CONSTRAINT "ProposedFollowupType_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposedFollowupType" ADD CONSTRAINT "ProposedFollowupType_followupTypeId_fkey" FOREIGN KEY ("followupTypeId") REFERENCES "FollowupType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
