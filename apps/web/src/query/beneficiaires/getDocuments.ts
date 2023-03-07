import { prismaClient } from '@mss/web/prismaClient'

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
