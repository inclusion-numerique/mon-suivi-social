import { createMutationServer } from '@mss/web/features/createMutation.server'
import { v4 } from 'uuid'
import { generateFileNumber } from '@mss/web/beneficiary/generateFileNumber'
import { AddBeneficiaryWithFullDataClient } from '@mss/web/features/beneficiary/addBeneficiary/addBeneficiaryWithFullData.client'

export const AddBeneficiaryWithFullDataServer = createMutationServer({
  client: AddBeneficiaryWithFullDataClient,
  executeMutation: async ({ input, transaction, user }) => {
    const { structureId, referents, ...data } = input

    const id = v4()
    const fileNumber = generateFileNumber()

    const beneficiary = await transaction.beneficiary.create({
      data: {
        id,
        structureId,
        fileNumber,
        referents: {
          connect: referents.map((id) => ({ id })),
        },
        createdById: user.id,
        ...data,
      },
    })

    return { beneficiary }
  },
  mutationLogInfo: ({
    input: { structureId },
    result: {
      beneficiary: { id },
    },
  }) => ({
    targetId: id,
    targetStructureId: structureId,
    targetBeneficiaryId: id,
  }),
})

export type AddBeneficiaryWithFullDataServer =
  typeof AddBeneficiaryWithFullDataServer
