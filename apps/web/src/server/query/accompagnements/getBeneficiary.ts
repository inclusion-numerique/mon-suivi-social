import { beneficiarySecurityTargetSelect } from '@mss/web/security/getBeneficiarySecurityTarget'
import { prismaClient } from '@mss/web/server/prisma/prismaClient'

const getBeneficiary = async (fileNumber: string) =>
  prismaClient.beneficiary.findUnique({
    where: {
      fileNumber,
    },
    select: {
      ...beneficiarySecurityTargetSelect,
      firstName: true,
      birthName: true,
      usualName: true,
      fileNumber: true,
      email: true,
      documents: {
        select: { key: true, type: true, name: true },
      },
    },
  })

export { getBeneficiary }
