import { Prisma, prismaClient } from '@mss/web/prismaClient'

const getBeneficiaryToView = (fileNumber: string) =>
  prismaClient.beneficiary.findFirstOrThrow({
    where: { fileNumber },
    include: {
      referents: true,
    },
  })

export { getBeneficiaryToView }

export type GetBeneficiaryToViewReturn = Prisma.PromiseReturnType<
  typeof getBeneficiaryToView
>
