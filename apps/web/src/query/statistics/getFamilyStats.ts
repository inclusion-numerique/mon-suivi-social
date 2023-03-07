import { sum } from '@mss/web/utils/sum'
import { Prisma, prismaClient } from '@mss/web/prismaClient'

export const getFamilyStats = async (structureId: string) => {
  const stats = await prismaClient.beneficiary.groupBy({
    by: ['familySituation'],
    where: {
      structureId,
    },
    _count: true,
    orderBy: { _count: { familySituation: 'desc' } },
  })
  const total = sum(stats, '_count')

  return { stats, total }
}

export type GetFamilyStatsReturn = Prisma.PromiseReturnType<
  typeof getFamilyStats
>
