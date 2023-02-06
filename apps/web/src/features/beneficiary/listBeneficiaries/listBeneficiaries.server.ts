import { ListBeneficiariesClient } from '@mss/web/features/beneficiary/listBeneficiaries/listBeneficiaries.client'
import { createQueryServer, QueryResult } from '@mss/web/features/createQuery'
import { takeAndSkipFromPagination } from '@mss/web/ui/pagination'

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
            select: { type: { select: { id: true, name: true } } },
            distinct: ['typeId'],
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
    const totalPages = Math.ceil(count / perPage) || 1

    return { beneficiaries, count, totalPages }
  },
})

export type ListBeneficiariesItem = QueryResult<
  typeof ListBeneficiariesServer
>['beneficiaries'][number]
