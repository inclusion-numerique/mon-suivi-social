import { prismaClient } from '@mss/web/prismaClient'

const getBeneficiary = (fileNumber: string) =>
  prismaClient.beneficiary.findFirstOrThrow({
    where: { fileNumber },
  })

export { getBeneficiary }
