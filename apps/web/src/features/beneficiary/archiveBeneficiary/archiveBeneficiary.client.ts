import { canDeleteBeneficiary } from '@mss/web/security/rules'
import z from 'zod'
import { createMutationClient } from '@mss/web/features/createMutation.client'

export const ArchiveBeneficiaryClient = createMutationClient({
  name: 'beneficiary.archive',
  securityCheck: canDeleteBeneficiary,
  inputValidation: z.object({
    beneficiaryId: z.string().uuid(),
  }),
  fieldLabels: {
    beneficiaryId: 'Identifiant',
  },
})
export type ArchiveBeneficiaryClient = typeof ArchiveBeneficiaryClient
