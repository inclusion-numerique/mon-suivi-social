/*
  Warnings:

  - You are about to drop the column `agentId` on the `Followup` table. All the data in the column will be lost.
  - You are about to drop the column `agentId` on the `HelpRequest` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('Cerfa', 'HistoriqueCourrier', 'Justificatifs', 'Rapports');

-- DropForeignKey
ALTER TABLE "Followup" DROP CONSTRAINT "Followup_agentId_fkey";

-- DropForeignKey
ALTER TABLE "HelpRequest" DROP CONSTRAINT "HelpRequest_agentId_fkey";

-- AlterTable
ALTER TABLE "Followup" DROP COLUMN "agentId",
ADD COLUMN     "createdById" UUID;

-- AlterTable
ALTER TABLE "HelpRequest" DROP COLUMN "agentId",
ADD COLUMN     "createdById" UUID;

-- CreateTable
CREATE TABLE "Document" (
    "key" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "tags" TEXT[],
    "confidential" BOOLEAN NOT NULL,
    "beneficiaryId" UUID NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" UUID NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("key")
);

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "Beneficiary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Followup" ADD CONSTRAINT "Followup_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HelpRequest" ADD CONSTRAINT "HelpRequest_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
