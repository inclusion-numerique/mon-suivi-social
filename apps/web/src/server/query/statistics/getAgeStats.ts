import { AgeGroup } from '@mss/web/client/options/ageGroup'
import { Prisma, prismaClient } from '@mss/web/server/prisma/prismaClient'

export const getAgeStats = async (structureId: string) => {
  const stats: [{ [ageGroup in AgeGroup]: number }] =
    await prismaClient.$queryRaw`
  WITH "BeneficiaryAge" AS (
    SELECT date_part('year', age("birth_date")) AS age, "birth_date"
    FROM "beneficiary"
    WHERE "structure_id" = ${structureId}::uuid
  )
  SELECT
    (count(*) filter (where age<25))::int as "less-25",
    (count(*) filter (where age>=25 and age<35))::int as "25-34",
    (count(*) filter (where age>=35 and age<45))::int as "35-44",
    (count(*) filter (where age>=45 and age<55))::int as "45-54",
    (count(*) filter (where age>=55 and age<65))::int as "55-64",
    (count(*) filter (where age>=65))::int as "65-more",
    (count(*) filter (where "birth_date" IS NULL))::int as "null"
  FROM "BeneficiaryAge"
    `

  return { stats: stats[0] }
}

export type GetAgeStatsReturn = Prisma.PromiseReturnType<typeof getAgeStats>
