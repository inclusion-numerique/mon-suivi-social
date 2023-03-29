import { getTotalPages, takeAndSkipFromPagination } from '@mss/web/utils/table'
import { prismaClient } from '@mss/web/server/prisma/prismaClient'
import { Prisma } from '@prisma/client'

export type StructuresListResult = Prisma.PromiseReturnType<
  typeof iterateStructures
>

export type StructuresList = StructuresListResult['structures']
export type StructuresListItem = StructuresList[number]

export const iterateStructures = async ({
  page,
  perPage,
  orderBy,
}: {
  page: number
  perPage: number
  orderBy: object[]
}) => {
  const { take, skip } = takeAndSkipFromPagination({
    perPage,
    page,
  })

  const [structures, count] = await Promise.all([
    prismaClient.structure.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        zipcode: true,
        type: true,
        city: true,
        phone: true,
        followups: {
          select: {
            types: {
              select: {
                id: true,
                name: true,
              },
              distinct: ['id'],
            },
          },
        },
        helpRequests: {
          select: { type: { select: { id: true, name: true } } },
          distinct: ['typeId'],
        },
        _count: {
          select: {
            followups: true,
            helpRequests: true,
            users: true,
            beneficiaries: true,
            proposedFollowupTypes: true,
          },
        },
      },
      take,
      skip,
      orderBy,
    }),
    prismaClient.structure.count({}),
  ])

  const totalPages = getTotalPages({ count, perPage })

  return { structures, count, totalPages }
}
