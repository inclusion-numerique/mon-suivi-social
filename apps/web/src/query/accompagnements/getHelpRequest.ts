import { beneficiarySecurityTargetSelect } from '@mss/web/security/getBeneficiarySecurityTarget'
import { prismaClient } from '@mss/web/server/prisma/prismaClient'

const getHelpRequest = async (helpRequestId: string) =>
  prismaClient.helpRequest.findFirst({
    where: {
      id: helpRequestId,
    },
    select: {
      structureId: true,
      createdById: true,
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

export { getHelpRequest }
