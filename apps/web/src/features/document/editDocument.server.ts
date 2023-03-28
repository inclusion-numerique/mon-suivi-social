import { createMutationServerWithInitialState } from '@mss/web/features/createMutation.server'
import { EditDocumentClient } from '@mss/web/features/document/editDocument.client'
import { prismaClient } from '@mss/web/server/prisma/prismaClient'
import { MutationInput } from '@mss/web/features/createMutation.client'
import { DocumentTag } from '@mss/web/constants/document'

export const EditDocumentServer = createMutationServerWithInitialState({
  client: EditDocumentClient,
  getServerState: async ({ key }: { key: string }) =>
    prismaClient.document.findUniqueOrThrow({
      where: { key },
    }),
  dataFromServerState: ({
    tags,
    ...data
  }): MutationInput<EditDocumentClient> => ({
    tags: tags as DocumentTag[],
    ...data,
  }),
  executeMutation: async ({ input, transaction }) => {
    const { key, ...data } = input

    const document = await transaction.document.update({
      where: { key },
      data: {
        ...data,
      },
      include: { beneficiary: { select: { id: true, structureId: true } } },
    })

    return { document }
  },
  mutationLogInfo: ({
    result: {
      document: {
        key,
        beneficiaryId,
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
export type EditDocumentServer = typeof EditDocumentServer
