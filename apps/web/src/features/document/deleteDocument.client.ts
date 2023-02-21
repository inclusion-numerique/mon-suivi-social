import z from 'zod'
import { createMutationClient } from '@mss/web/features/createMutation.client'
import { canDeleteBeneficiaryDocument } from '@mss/web/security/rules'

export const DeleteDocumentClient = createMutationClient({
  name: 'document.delete',
  title: 'Supression de document',
  securityCheck: canDeleteBeneficiaryDocument,
  inputValidation: z.object({
    documentKey: z.string(),
  }),
  fieldLabels: {
    documentKey: 'Document',
  },
})

export type DeleteDocumentClient = typeof DeleteDocumentClient
