import { getTotalPages, takeAndSkipFromPagination } from '@mss/web/utils/table'
import { prismaClient } from '@mss/web/prismaClient'
import { Prisma } from '@prisma/client'

export type IterateFollowupsReturn = ReturnType<typeof iterateFollowups>

export type FollowupsListResult = Prisma.PromiseReturnType<
  typeof iterateFollowups
>

export type FollowupsList = FollowupsListResult['followups']
export type FollowupsListItem = FollowupsList[number]

export const iterateFollowups = async ({
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

  const [followups, count] = await Promise.all([
    prismaClient.followup.findMany({
      where: {
        beneficiary: {
          archived: null,
        },
      },
      select: {
        id: true,
        status: true,
        medium: true,
        types: { select: { id: true, name: true } },
        dueDate: true,
        beneficiary: {
          select: {
            id: true,
            fileNumber: true,
            firstName: true,
            birthName: true,
            usualName: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      take,
      skip,
      orderBy,
    }),
    prismaClient.followup.count({}),
  ])

  const totalPages = getTotalPages({ count, perPage })

  return { followups, count, totalPages }
}
