import { beneficiarySecurityTargetSelect } from '@mss/web/security/getBeneficiarySecurityTarget'
import { Prisma, prismaClient } from '@mss/web/prismaClient'

type FindByIdType = Prisma.PromiseReturnType<typeof findById>

const findById = async (followupId: string) =>
  prismaClient.followup.findFirst({
    where: {
      id: followupId,
    },
    select: {
      createdById: true,
      structureId: true,
      beneficiary: {
        select: {
          ...beneficiarySecurityTargetSelect,
          firstName: true,
          birthName: true,
          usualName: true,
          email: true,
          fileNumber: true,
          documents: {
            select: { key: true, type: true, name: true },
          },
        },
      },
    },
  })

export { findById }

export type { FindByIdType }
