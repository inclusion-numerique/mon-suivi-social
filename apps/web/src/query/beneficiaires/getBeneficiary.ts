import { prismaClient } from '@mss/web/server/prisma/prismaClient'

const getBeneficiary = (fileNumber: string) =>
  prismaClient.beneficiary.findFirstOrThrow({
    where: { fileNumber },
  })

export { getBeneficiary }
