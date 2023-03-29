import { beneficiarySecurityTargetSelect } from '@mss/web/security/getBeneficiarySecurityTarget'
import { Prisma, prismaClient } from '@mss/web/server/prisma/prismaClient'

type GetFollowupReturn = Prisma.PromiseReturnType<typeof getFollowup>

const getFollowup = async (followupId: string) =>
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

export { getFollowup }

export type { GetFollowupReturn }
