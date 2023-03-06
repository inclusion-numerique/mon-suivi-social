import { beneficiarySecurityTargetSelect } from '@mss/web/security/getBeneficiarySecurityTarget'
import { prismaClient } from '@mss/web/prismaClient'

const findByFileNumber = async (fileNumber: string) =>
  prismaClient.beneficiary.findUnique({
    where: {
      fileNumber,
    },
  })

export { findByFileNumber }
