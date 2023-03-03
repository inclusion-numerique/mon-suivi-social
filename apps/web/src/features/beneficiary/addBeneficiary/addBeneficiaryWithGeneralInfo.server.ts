import { createMutationServer } from '@mss/web/features/createMutation.server'
import { AddBeneficiaryWithGeneralInfoClient } from '@mss/web/features/beneficiary/addBeneficiary/addBeneficiaryWithGeneralInfo.client'
import { v4 } from 'uuid'
import { generateFileNumber } from '@mss/web/utils/generateFileNumber'

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
          connect: referents.map((referent) => ({ id: referent })),
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

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type AddBeneficiaryWithGeneralInfoServer =
  typeof AddBeneficiaryWithGeneralInfoServer
