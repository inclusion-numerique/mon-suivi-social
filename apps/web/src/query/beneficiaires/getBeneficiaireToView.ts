import { Prisma, prismaClient } from '@mss/web/prismaClient'

const getBeneficiaireToView = (fileNumber: string) =>
  prismaClient.beneficiary.findFirstOrThrow({
    where: { fileNumber },
    include: {
      referents: true,
    },
  })

export { getBeneficiaireToView }

export type GetBeneficiaireToViewReturn = Prisma.PromiseReturnType<
  typeof getBeneficiaireToView
>
