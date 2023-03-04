import { ListFollowupsClient } from '@mss/web/features/followup/listFollowups/listFollowups.client'
import {
  createQueryServer,
  QueryResult,
} from '@mss/web/features/createQuery.server'
import {
  getTotalPages,
  takeAndSkipFromPagination,
} from '@mss/web/components/Generic/pagination'

export const ListFollowupsServer = createQueryServer({
  client: ListFollowupsClient,
  executeQuery: async ({ prisma, input: { page, perPage, orderBy } }) => {
    const { take, skip } = takeAndSkipFromPagination({
      perPage,
      page,
    })

    const [followups, count] = await Promise.all([
      prisma.followup.findMany({
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
      prisma.followup.count({}),
    ])

    const totalPages = getTotalPages({ count, perPage })

    return { followups, count, totalPages }
  },
})

export type ListFollowupsItem = QueryResult<
  typeof ListFollowupsServer
>['followups'][number]
