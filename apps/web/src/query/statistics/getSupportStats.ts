import { Prisma, prismaClient } from '@mss/web/prismaClient'

export const getSupportStats = async (structureId: string) => {
  const stats = await prismaClient.followupType.findMany({
    where: {
      proposedFollowupTypes: {
        some: { structureId },
      },
    },
    include: {
      _count: {
        select: {
          followups: { where: { structureId } },
          helpRequests: { where: { structureId } },
        },
      },
    },
  })

  const sorted = stats.sort(
    (a, b) =>
      b._count.followups +
      b._count.helpRequests -
      (a._count.followups + a._count.helpRequests),
  )

  const total = stats.reduce(
    (
      result,
      { _count },
    ): { followups: number; helpRequests: number; total: number } => {
      result.followups += _count.followups
      result.helpRequests += _count.helpRequests
      result.total += _count.followups + _count.helpRequests

      return result
    },
    { total: 0, followups: 0, helpRequests: 0 },
  )

  return { stats: sorted, total }
}

export type GetSupportStatsReturn = Prisma.PromiseReturnType<
  typeof getSupportStats
>
