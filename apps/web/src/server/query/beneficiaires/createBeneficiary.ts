import { BeneficiaryCreationInput } from '@mss/web/server/schema'
import { prismaClient } from '@mss/web/server/prisma/prismaClient'
import { generateFileNumber } from '@mss/web/utils/generateFileNumber'
import { BeneficiaryStatus } from '@prisma/client'
import { v4 } from 'uuid'

async function createBeneficiary(
  input: BeneficiaryCreationInput,
  user: { id: string },
) {
  const { structureId, referents, ...data } = input

  const id = v4()
  const fileNumber = generateFileNumber()

  const beneficiary = await prismaClient.beneficiary.create({
    data: {
      id,
      status: BeneficiaryStatus.Active,
      structureId,
      fileNumber,
      referents: {
        connect: referents.map((referent) => ({ id: referent })),
      },
      createdById: user.id,
      ...data,
    },
  })

  return { beneficiary }
}

export { createBeneficiary }
