import { createMutationServerWithInitialState } from '@mss/web/features/createMutation.server'
import { EditFollowupClient } from '@mss/web/features/followup/editFollowup.client'
import { prismaClient } from '@mss/web/prismaClient'
import { MutationInput } from '@mss/web/features/createMutation.client'
import { removeNullAndUndefinedValues } from '@mss/web/utils/removeNullAndUndefinedValues'
import { computeArrayDiff } from '@mss/web/utils/diff'

export const EditFollowupServer = createMutationServerWithInitialState({
  client: EditFollowupClient,
  getServerState: async ({ followupId }: { followupId: string }) =>
    prismaClient.followup.findUniqueOrThrow({
      where: { id: followupId },
      // Only select general info
      include: {
        types: true,
        documents: true,
      },
    }),
  dataFromServerState: ({
    id,
    types,
    documents,
    date,
    dueDate,
    created,
    updated,
    createdById,
    ...data
  }): MutationInput<EditFollowupClient> => {
    return {
      followupId: id,
      types: types.map(({ id }) => id),
      documents: documents.map(({ key }) => key),
      date: date?.toISOString(),
      dueDate: dueDate?.toISOString(),
      ...removeNullAndUndefinedValues(data),
    }
  },
  executeMutation: async ({ input, transaction, initialInput }) => {
    const { followupId, types, documents, ...data } = input

    const typesDiff = computeArrayDiff(initialInput.types, input.types)
    const documentsDiff = computeArrayDiff(
      initialInput.documents,
      input.documents,
    )

    const followup = await transaction.followup.update({
      where: { id: followupId },
      data: {
        updated: new Date(),
        types: {
          connect: typesDiff.added.map((id) => ({ id })),
          disconnect: typesDiff.removed.map((id) => ({ id })),
        },
        documents: {
          connect: documentsDiff.added.map((key) => ({ key })),
          disconnect: documentsDiff.removed.map((key) => ({ key })),
        },
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
    input: { beneficiaryId, followupId },
    result: {
      followup: { structureId },
    },
  }) => ({
    targetId: followupId,
    targetStructureId: structureId,
    targetBeneficiaryId: beneficiaryId,
  }),
})

export type EditFollowupServer = typeof EditFollowupServer
