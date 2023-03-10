import { getTotalPages, takeAndSkipFromPagination } from '@mss/web/utils/table'
import { Prisma, UserRole } from '@prisma/client'
import { prismaClient } from '@mss/web/prismaClient'

export type UserListResult = Prisma.PromiseReturnType<typeof iterateUsers>

export type UserList = UserListResult['users']
export type UserListItem = UserList[number]

export const iterateUsers = async ({
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
  const where = {
    role: {
      not: UserRole.Administrator,
    },
  }

  const [users, count] = await Promise.all([
    prismaClient.user.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        name: true,
        email: true,
        status: true,
        role: true,
        _count: {
          select: {
            referentFor: true,
          },
        },
      },
      take,
      skip,
      orderBy,
    }),
    prismaClient.user.count({ where }),
  ])

  const totalPages = getTotalPages({ count, perPage })

  return { users, count, totalPages }
}
