/*
  Warnings:

  - You are about to drop the column `structureId` on the `FollowupType` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,ownedByStructureId]` on the table `FollowupType` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "FollowupType" DROP CONSTRAINT "FollowupType_structureId_fkey";

-- DropIndex
DROP INDEX "FollowupType_name_key";

-- AlterTable
ALTER TABLE "FollowupType" DROP COLUMN "structureId",
ADD COLUMN     "ownedByStructureId" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "FollowupType_name_ownedByStructureId_key" ON "FollowupType"("name", "ownedByStructureId");

-- AddForeignKey
ALTER TABLE "FollowupType" ADD CONSTRAINT "FollowupType_ownedByStructureId_fkey" FOREIGN KEY ("ownedByStructureId") REFERENCES "Structure"("id") ON DELETE SET NULL ON UPDATE CASCADE;
