import { createMutationServer } from '@mss/web/features/createMutation.server'
import { AddDocumentClient } from '@mss/web/features/document/addDocument.client'

export const AddDocumentServer = createMutationServer({
  client: AddDocumentClient,
  executeMutation: async ({ input, transaction, user }) => {
    const { type, beneficiaryId, confidential, tags, file } = input

    const document = await transaction.document.create({
      data: {
        beneficiaryId,
        type,
        confidential,
        tags,
        createdById: user.id,
        ...file,
      },
      include: {
        beneficiary: {
          select: {
            id: true,
            structureId: true,
            fileNumber: true,
          },
        },
      },
    })

    return { document }
  },
  mutationLogInfo: ({
    input: { beneficiaryId },
    result: {
      document: {
        key,
        beneficiary: { structureId },
      },
    },
  }) => ({
    targetId: key,
    targetStructureId: structureId,
    targetBeneficiaryId: beneficiaryId,
  }),
})

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type AddDocumentServer = typeof AddDocumentServer
