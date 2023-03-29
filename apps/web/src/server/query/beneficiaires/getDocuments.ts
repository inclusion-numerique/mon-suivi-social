import { prismaClient } from '@mss/web/server/prisma/prismaClient'

export function getDocuments({
  beneficiaryId,
}: {
  userId: string
  beneficiaryId: string
}) {
  return prismaClient.document.findMany({
    where: { beneficiaryId },
  })
}
