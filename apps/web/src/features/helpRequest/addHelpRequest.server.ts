import { createMutationServer } from '@mss/web/features/createMutation.server'
import { v4 } from 'uuid'
import { AddHelpRequestClient } from '@mss/web/features/helpRequest/addHelpRequest.client'

export const AddHelpRequestServer = createMutationServer({
  client: AddHelpRequestClient,
  executeMutation: async ({ input, transaction }) => {
    const { beneficiaryId, structureId, type, documents, ...data } = input

    const id = v4()

    const helpRequest = await transaction.helpRequest.create({
      data: {
        id,
        structureId,
        beneficiaryId,
        typeId: type,
        documents: {
          connect: documents.map((key) => ({ key })),
        },
        ...data,
      },
    })

    return { helpRequest }
  },
  mutationLogInfo: ({
    input: { structureId, beneficiaryId },
    result: {
      helpRequest: { id },
    },
  }) => ({
    targetId: id,
    targetStructureId: structureId,
    targetBeneficiaryId: beneficiaryId,
  }),
})

export type AddHelpRequestServer = typeof AddHelpRequestServer
