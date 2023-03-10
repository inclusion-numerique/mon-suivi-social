import { Prisma, prismaClient } from '@mss/web/prismaClient'
import { getTotalPages, takeAndSkipFromPagination } from '@mss/web/utils/table'

type ListBeneficiariesInput = {
  structureId: string
  page: number
  perPage: number
  orderBy: object[]
  search: string | undefined
}

export const iterateBeneficiaries = async ({
  structureId,
  page,
  perPage,
  orderBy,
}: ListBeneficiariesInput) => {
  const { take, skip } = takeAndSkipFromPagination({
    perPage,
    page,
  })

  const where = { structureId, archived: null }

  const [beneficiaries, count] = await Promise.all([
    prismaClient.beneficiary.findMany({
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
    prismaClient.beneficiary.count({
      where,
    }),
  ])
  const totalPages = getTotalPages({ count, perPage })

  return { beneficiaries, count, totalPages }
}

export type BeneficiaryListResult = Prisma.PromiseReturnType<
  typeof iterateBeneficiaries
>

export type BeneficiaryList = BeneficiaryListResult['beneficiaries']
export type BeneficiaryListItem = BeneficiaryList[number]
