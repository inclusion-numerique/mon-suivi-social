import { prismaClient } from '@mss/web/prismaClient'
import { beneficiarySecurityTargetSelect } from '@mss/web/security/getBeneficiarySecurityTarget'

const getBeneficiaryToUpdate = async (fileNumber: string) =>
  prismaClient.beneficiary.findFirst({
    where: { fileNumber, archived: null },
    select: {
      ...beneficiarySecurityTargetSelect,
      fileNumber: true,
      firstName: true,
      birthName: true,
      usualName: true,
      email: true,
    },
  })

export { getBeneficiaryToUpdate }
