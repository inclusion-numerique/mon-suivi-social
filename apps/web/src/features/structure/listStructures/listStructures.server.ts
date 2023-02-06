import { ListStructuresClient } from '@mss/web/features/structure/listStructures/listStructures.client'
import {
  createQueryServer,
  QueryResult,
} from '@mss/web/features/createQuery.server'
import {
  getTotalPages,
  takeAndSkipFromPagination,
} from '@mss/web/ui/pagination'

export const ListStructuresServer = createQueryServer({
  client: ListStructuresClient,
  executeQuery: async ({ prisma, input: { page, perPage, orderBy } }) => {
    const { take, skip } = takeAndSkipFromPagination({
      perPage,
      page,
    })

    const [structures, count] = await Promise.all([
      prisma.structure.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          zipcode: true,
          type: true,
          city: true,
          phone: true,
          followups: {
            select: { type: { select: { id: true, name: true } } },
            distinct: ['typeId'],
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
        // orderBy,
        orderBy: {
          users: { _count: 'asc' },
        },
      }),
      prisma.structure.count({}),
    ])

    const totalPages = getTotalPages({ count, perPage })

    return { structures, count, totalPages }
  },
})

export type ListStructuresItem = QueryResult<
  typeof ListStructuresServer
>['structures'][number]