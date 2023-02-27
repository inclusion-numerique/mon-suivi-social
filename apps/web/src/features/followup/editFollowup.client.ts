import { canEditBeneficiaryFollowup } from '@mss/web/security/rules'
import z from 'zod'
import { createMutationClient } from '@mss/web/features/createMutation.client'
import { AddFollowupClient } from '@mss/web/features/followup/addFollowup.client'

export const EditFollowupClient = createMutationClient({
  name: 'followup.edit',
  title: "Modification d'entretien",
  securityCheck: canEditBeneficiaryFollowup,
  inputValidation: AddFollowupClient.inputValidation.extend({
    followupId: z.string().uuid(),
  }),
  beneficiaryAnonymization: AddFollowupClient.beneficiaryAnonymization,
  fieldLabels: {
    followupId: 'Entretien',
    ...AddFollowupClient.fieldLabels,
  },
})

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type EditFollowupClient = typeof EditFollowupClient
