import { prismaClient } from '@mss/web/prismaClient'

const findByBeneficiary = ({ beneficiaryId }: { beneficiaryId: string }) =>
  prismaClient.followupType.findMany({
    where: {
      OR: [
        {
          followups: { some: { beneficiaryId } },
        },
        {
          helpRequests: { some: { beneficiaryId } },
        },
      ],
    },
  })

export { findByBeneficiary }
