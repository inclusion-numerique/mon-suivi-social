import { createMutationServer } from '@mss/web/features/createMutation.server'
import { v4 } from 'uuid'
import { AddFollowupClient } from '@mss/web/features/followup/addFollowup.client'

export const AddFollowupServer = createMutationServer({
  client: AddFollowupClient,
  executeMutation: async ({ input, transaction, user }) => {
    const { beneficiaryId, structureId, types, documents, ...data } = input

    const id = v4()

    const followup = await transaction.followup.create({
      data: {
        id,
        structureId,
        beneficiaryId,
        types: {
          connect: types.map((id) => ({ id })),
        },
        documents: {
          connect: documents.map((key) => ({ key })),
        },
        createdById: user.id,
        ...data,
      },
    })

    return { followup }
  },
  mutationLogInfo: ({
    input: { structureId, beneficiaryId },
    result: {
      followup: { id },
    },
  }) => ({
    targetId: id,
    targetStructureId: structureId,
    targetBeneficiaryId: beneficiaryId,
  }),
})

export type AddFollowupServer = typeof AddFollowupServer
