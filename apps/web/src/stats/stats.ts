import { prismaClient } from '@mss/web/prismaClient'
import { sum } from '@mss/web/utils/sum'
import { AgeGroup } from '@mss/web/wording/ageGroup'

export const getGenderStats = async (organisationId: string) => {
  const stats = await prismaClient.beneficiary.groupBy({
    by: ['gender'],
    where: {
      organisationId,
    },
    _count: true,
    orderBy: { _count: { gender: 'desc' } },
  })
  const total = sum(stats, '_count')

  return { stats, total }
}

export type GenderStats = Awaited<ReturnType<typeof getGenderStats>>

export const getFamilyStats = async (organisationId: string) => {
  const stats = await prismaClient.beneficiary.groupBy({
    by: ['familySituation'],
    where: {
      organisationId,
    },
    _count: true,
    orderBy: { _count: { familySituation: 'desc' } },
  })
  const total = sum(stats, '_count')

  return { stats, total }
}

export type FamilySituationStats = Awaited<ReturnType<typeof getFamilyStats>>

export const getAgeStats = async (organisationId: string) => {
  const stats: [{ [ageGroup in AgeGroup]: number }] =
    await prismaClient.$queryRaw`
WITH "BeneficiaryAge" AS (
  SELECT date_part('year', age("birthDate")) AS age, "birthDate"
  FROM "Beneficiary"
  WHERE "organisationId" = ${organisationId}::uuid
)
SELECT
  (count(*) filter (where age<25))::int as "less-25",
  (count(*) filter (where age>=25 and age<35))::int as "25-34",
  (count(*) filter (where age>=35 and age<45))::int as "35-44",
  (count(*) filter (where age>=45 and age<55))::int as "45-54",
  (count(*) filter (where age>=55 and age<65))::int as "55-64",
  (count(*) filter (where age>=65))::int as "65-more",
  (count(*) filter (where "birthDate" IS NULL))::int as "null"
FROM "BeneficiaryAge"
  `

  return { stats: stats[0] }
}

export type AgeStats = Awaited<ReturnType<typeof getAgeStats>>

export const getSupportStats = async (organisationId: string) => {
  const stats = await prismaClient.followupType.findMany({
    where: {
      organisations: {
        some: { id: organisationId },
      },
    },
    include: {
      _count: {
        select: { followups: true, helpRequests: true },
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
export type SupportStats = Awaited<ReturnType<typeof getSupportStats>>
