import { prismaClient } from '@mss/web/prismaClient'

const getBeneficiaire = (fileNumber: string) =>
  prismaClient.beneficiary.findFirstOrThrow({
    where: { fileNumber },
  })

export { getBeneficiaire }
