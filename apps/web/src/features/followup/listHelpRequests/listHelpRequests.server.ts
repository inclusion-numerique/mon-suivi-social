import {
  createQueryServer,
  QueryResult,
} from '@mss/web/features/createQuery.server'
import {
  getTotalPages,
  takeAndSkipFromPagination,
} from '@mss/web/ui/pagination'
import { ListHelpRequestsClient } from '@mss/web/features/followup/listHelpRequests/listHelpRequests.client'

export const ListHelpRequestsServer = createQueryServer({
  client: ListHelpRequestsClient,
  executeQuery: async ({ prisma, input: { page, perPage, orderBy } }) => {
    const { take, skip } = takeAndSkipFromPagination({
      perPage,
      page,
    })

    const [helpRequests, count] = await Promise.all([
      prisma.helpRequest.findMany({
        select: {
          id: true,
          status: true,
          type: { select: { id: true, name: true } },
          dueDate: true,
          examiningOrganisation: true,
          examinationDate: true,
          askedAmount: true,
          allocatedAmount: true,
          paymentMethod: true,
          paymentDate: true,
          handlingDate: true,
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
      prisma.helpRequest.count({}),
    ])

    const totalPages = getTotalPages({ count, perPage })

    return { helpRequests, count, totalPages }
  },
})

export type ListHelpRequestsItem = QueryResult<
  typeof ListHelpRequestsServer
>['helpRequests'][number]
