import { ListBeneficiariesClient } from '@mss/web/features/beneficiary/listBeneficiaries/listBeneficiaries.client'
import {
  createQueryServer,
  QueryResult,
} from '@mss/web/features/createQuery.server'
import {
  getTotalPages,
  takeAndSkipFromPagination,
} from '@mss/web/components/Generic/pagination'

export const ListBeneficiariesServer = createQueryServer({
  client: ListBeneficiariesClient,
  executeQuery: async ({
    prisma,
    input: { structureId, page, perPage, orderBy },
  }) => {
    const { take, skip } = takeAndSkipFromPagination({
      perPage,
      page,
    })

    const where = { structureId, archived: null }

    const [beneficiaries, count] = await Promise.all([
      prisma.beneficiary.findMany({
        where,
        select: {
          id: true,
          usualName: true,
          birthName: true,
          firstName: true,
          birthDate: true,
          streetNumber: true,
          street: true,
          zipcode: true,
          city: true,
          phone1: true,
          phone2: true,
          status: true,
          fileNumber: true,
          referents: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              name: true,
              email: true,
            },
          },
          followups: {
            select: {
              types: { select: { id: true, name: true }, distinct: ['id'] },
            },
          },
          helpRequests: {
            select: { type: { select: { id: true, name: true } } },
            distinct: ['typeId'],
          },
          _count: {
            select: { followups: true, helpRequests: true, referents: true },
          },
        },
        take,
        skip,
        orderBy,
      }),
      prisma.beneficiary.count({
        where,
      }),
    ])
    const totalPages = getTotalPages({ count, perPage })

    return { beneficiaries, count, totalPages }
  },
})

export type ListBeneficiariesItem = QueryResult<
  typeof ListBeneficiariesServer
>['beneficiaries'][number]
