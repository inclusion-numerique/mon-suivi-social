import { createMutationServer } from '@mss/web/features/createMutation.server'
import { v4 } from 'uuid'
import { AddFollowupClient } from '@mss/web/features/followup/addFollowup.client'

export const AddFollowupServer = createMutationServer({
  client: AddFollowupClient,
  executeMutation: async ({ input, transaction, user }) => {
    const { beneficiaryId, types, documents, ...data } = input

    const id = v4()

    // TODO better way to pass along structureId in mutation context extra props
    const { structureId } = await transaction.beneficiary.findUniqueOrThrow({
      where: { id: beneficiaryId },
      select: { structureId: true },
    })

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
      include: {
        beneficiary: {
          select: {
            id: true,
            fileNumber: true,
          },
        },
      },
    })

    return { followup }
  },
  mutationLogInfo: ({
    input: { beneficiaryId },
    result: {
      followup: { id, structureId },
    },
  }) => ({
    targetId: id,
    targetStructureId: structureId,
    targetBeneficiaryId: beneficiaryId,
  }),
})

export type AddFollowupServer = typeof AddFollowupServer
