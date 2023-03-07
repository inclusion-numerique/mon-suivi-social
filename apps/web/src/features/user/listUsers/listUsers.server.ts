import { ListUsersClient } from '@mss/web/features/user/listUsers/listUsers.client'
import {
  createQueryServer,
  QueryResult,
} from '@mss/web/features/createQuery.server'
import { getTotalPages, takeAndSkipFromPagination } from '@mss/web/utils/table'
import { UserRole } from '@prisma/client'

export const ListUsersServer = createQueryServer({
  client: ListUsersClient,
  executeQuery: async ({ prisma, input: { page, perPage, orderBy } }) => {
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
      prisma.user.findMany({
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
      prisma.user.count({ where }),
    ])

    const totalPages = getTotalPages({ count, perPage })

    return { users, count, totalPages }
  },
})

export type ListUsersItem = QueryResult<typeof ListUsersServer>['users'][number]
