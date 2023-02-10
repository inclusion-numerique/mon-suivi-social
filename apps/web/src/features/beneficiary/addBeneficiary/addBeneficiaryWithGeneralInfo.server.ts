import { createMutationServer } from '@mss/web/features/createMutation.server'
import { AddBeneficiaryWithGeneralInfoClient } from '@mss/web/features/beneficiary/addBeneficiary/addBeneficiaryWithGeneralInfo.client'
import { v4 } from 'uuid'
import { generateFileNumber } from '@mss/web/beneficiary/generateFileNumber'

export const AddBeneficiaryWithGeneralInfoServer = createMutationServer({
  client: AddBeneficiaryWithGeneralInfoClient,
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
    targetId: structureId,
    targetStructureId: structureId,
    targetBeneficiaryId: id,
  }),
})

export type AddBeneficiaryWithGeneralInfoServer =
  typeof AddBeneficiaryWithGeneralInfoServer
