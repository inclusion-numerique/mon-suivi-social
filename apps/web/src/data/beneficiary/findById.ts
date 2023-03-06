import { Prisma, prismaClient } from '@mss/web/prismaClient'

type FindByIdType = Prisma.PromiseReturnType<typeof findById>

const findById = async (beneficiaryId: string) =>
  prismaClient.beneficiary.findUniqueOrThrow({
    where: { id: beneficiaryId },
    select: {
      id: true,
      followups: {
        select: {
          id: true,
        },
        include: {
          createdBy: true,
          types: true,
        },
        orderBy: {
          date: 'desc',
        },
      },
      helpRequests: {
        include: {
          createdBy: true,
          type: true,
          prescribingOrganization: true,
        },
        orderBy: {
          openingDate: 'desc',
        },
      },
    },
  })

export { findById }
export type { FindByIdType }
