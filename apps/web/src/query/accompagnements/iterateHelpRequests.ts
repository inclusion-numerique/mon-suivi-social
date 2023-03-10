import { getTotalPages, takeAndSkipFromPagination } from '@mss/web/utils/table'
import { prismaClient } from '@mss/web/prismaClient'
import { Prisma } from '@prisma/client'

export type HelpRequestsListResult = Prisma.PromiseReturnType<
  typeof iterateHelpRequests
>

export type HelpRequestsList = HelpRequestsListResult['helpRequests']
export type HelpRequestsListItem = HelpRequestsList[number]

export const iterateHelpRequests = async ({
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

  const [helpRequests, count] = await Promise.all([
    prismaClient.helpRequest.findMany({
      where: {
        beneficiary: {
          archived: null,
        },
      },
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
    prismaClient.followup.count({}),
  ])

  const totalPages = getTotalPages({ count, perPage })

  return { helpRequests, count, totalPages }
}
