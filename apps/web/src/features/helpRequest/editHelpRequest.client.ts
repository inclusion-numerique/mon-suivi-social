import { canEditBeneficiaryHelpRequest } from '@mss/web/security/rules'
import z from 'zod'
import { createMutationClient } from '@mss/web/features/createMutation.client'
import { AddHelpRequestClient } from '@mss/web/features/helpRequest/addHelpRequest.client'
import { editHelpRequestSchema } from '@mss/web/server/schema'

export const EditHelpRequestClient = createMutationClient({
  name: 'helpRequest.edit',
  title: "Modification de demande d'aide",
  securityCheck: canEditBeneficiaryHelpRequest,
  inputValidation: editHelpRequestSchema,
  beneficiaryAnonymization: AddHelpRequestClient.beneficiaryAnonymization,
  fieldLabels: {
    helpRequestId: "Demande d'aide",
    ...AddHelpRequestClient.fieldLabels,
  },
})

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type EditHelpRequestClient = typeof EditHelpRequestClient
