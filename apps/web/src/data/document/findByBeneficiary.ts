import { prismaClient } from '@mss/web/prismaClient'

export function findByBeneficiary({
  beneficiaryId,
}: {
  userId: string
  beneficiaryId: string
}) {
  prismaClient.document.findMany({
    where: { beneficiaryId },
  })
}
