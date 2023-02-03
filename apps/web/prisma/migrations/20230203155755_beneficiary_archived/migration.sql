-- AlterTable
ALTER TABLE "Beneficiary" ADD COLUMN     "archived" TIMESTAMP(3),
ADD COLUMN     "archivedById" UUID;

-- AddForeignKey
ALTER TABLE "Beneficiary" ADD CONSTRAINT "Beneficiary_archivedById_fkey" FOREIGN KEY ("archivedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
