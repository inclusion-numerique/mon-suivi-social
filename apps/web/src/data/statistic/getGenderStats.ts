import { Prisma, prismaClient } from '@mss/web/prismaClient'
import { sum } from '@mss/web/utils/sum'

export const getGenderStats = async (structureId: string) => {
  const stats = await prismaClient.beneficiary.groupBy({
    by: ['gender'],
    where: {
      structureId,
    },
    _count: true,
    orderBy: { _count: { gender: 'desc' } },
  })
  const total = sum(stats, '_count')

  return { stats, total }
}

export type GetGenderStatsReturn = Prisma.PromiseReturnType<
  typeof getGenderStats
>
