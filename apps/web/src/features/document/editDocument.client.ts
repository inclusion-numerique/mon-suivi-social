import z from 'zod'
import { createMutationClient } from '@mss/web/features/createMutation.client'
import { AddDocumentClient } from '@mss/web/features/document/addDocument.client'
import { canEditBeneficiaryDocument } from '@mss/web/security/rules'

export const EditDocumentClient = createMutationClient({
  name: 'document.edit',
  securityCheck: canEditBeneficiaryDocument,
  inputValidation: AddDocumentClient.inputValidation
    .omit({ file: true })
    .extend({
      key: z.string(),
    }),
  // TODO review anonymization functions
  beneficiaryAnonymization: ({ ...data }) => ({
    ...data,
  }),
  fieldLabels: {
    key: 'Document',
    ...AddDocumentClient.fieldLabels,
  },
})

export type EditDocumentClient = typeof EditDocumentClient
