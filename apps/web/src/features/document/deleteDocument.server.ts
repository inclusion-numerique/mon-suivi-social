import { createMutationServer } from '@mss/web/features/createMutation.server'
import { DeleteDocumentClient } from '@mss/web/features/document/deleteDocument.client'
import { deleteUploadedFile } from '@mss/web/lib/s3/deleteUploadedFile'
import * as Sentry from '@sentry/nextjs'

export const DeleteDocumentServer = createMutationServer({
  client: DeleteDocumentClient,
  executeMutation: async ({ input, transaction }) => {
    const { documentKey } = input

    const document = await transaction.document.delete({
      where: { key: documentKey },
      include: {
        beneficiary: {
          select: { id: true, structureId: true },
        },
      },
    })
    deleteUploadedFile({ key: documentKey }).catch((error) =>
      Sentry.captureException(error, { tags: { sensitive: true } }),
    )

    return { document }
  },
  mutationLogInfo: ({
    input: { documentKey },
    result: {
      document: {
        beneficiaryId,
        beneficiary: { structureId },
      },
    },
  }) => ({
    targetId: documentKey,
    targetStructureId: structureId,
    targetBeneficiaryId: beneficiaryId,
  }),
})

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DeleteDocumentServer = typeof DeleteDocumentServer
