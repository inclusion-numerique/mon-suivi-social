/*
  Warnings:

  - You are about to drop the column `typeId` on the `Followup` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Followup" DROP CONSTRAINT "Followup_typeId_fkey";

-- AlterTable
ALTER TABLE "Followup" DROP COLUMN "typeId";

-- CreateTable
CREATE TABLE "_DocumentToFollowup" (
    "A" TEXT NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_DocumentToHelpRequest" (
    "A" TEXT NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_FollowupToFollowupType" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DocumentToFollowup_AB_unique" ON "_DocumentToFollowup"("A", "B");

-- CreateIndex
CREATE INDEX "_DocumentToFollowup_B_index" ON "_DocumentToFollowup"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DocumentToHelpRequest_AB_unique" ON "_DocumentToHelpRequest"("A", "B");

-- CreateIndex
CREATE INDEX "_DocumentToHelpRequest_B_index" ON "_DocumentToHelpRequest"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FollowupToFollowupType_AB_unique" ON "_FollowupToFollowupType"("A", "B");

-- CreateIndex
CREATE INDEX "_FollowupToFollowupType_B_index" ON "_FollowupToFollowupType"("B");

-- AddForeignKey
ALTER TABLE "_DocumentToFollowup" ADD CONSTRAINT "_DocumentToFollowup_A_fkey" FOREIGN KEY ("A") REFERENCES "Document"("key") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentToFollowup" ADD CONSTRAINT "_DocumentToFollowup_B_fkey" FOREIGN KEY ("B") REFERENCES "Followup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentToHelpRequest" ADD CONSTRAINT "_DocumentToHelpRequest_A_fkey" FOREIGN KEY ("A") REFERENCES "Document"("key") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentToHelpRequest" ADD CONSTRAINT "_DocumentToHelpRequest_B_fkey" FOREIGN KEY ("B") REFERENCES "HelpRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FollowupToFollowupType" ADD CONSTRAINT "_FollowupToFollowupType_A_fkey" FOREIGN KEY ("A") REFERENCES "Followup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FollowupToFollowupType" ADD CONSTRAINT "_FollowupToFollowupType_B_fkey" FOREIGN KEY ("B") REFERENCES "FollowupType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
