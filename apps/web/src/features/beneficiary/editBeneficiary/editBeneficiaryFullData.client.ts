import { canEditBeneficiaryFullInfo } from '@mss/web/security/rules'
import z from 'zod'
import { createMutationClient } from '@mss/web/features/createMutation.client'
import { AddBeneficiaryWithFullDataClient } from '@mss/web/features/beneficiary/addBeneficiary/addBeneficiaryWithFullData.client'

export const EditBeneficiaryFullDataClient = createMutationClient({
  name: 'beneficiary.editFullData',
  securityCheck: canEditBeneficiaryFullInfo,
  inputValidation: AddBeneficiaryWithFullDataClient.inputValidation.extend({
    beneficiaryId: z.string().uuid(),
  }),
  beneficiaryAnonymization:
    AddBeneficiaryWithFullDataClient.beneficiaryAnonymization,
  fieldLabels: {
    beneficiaryId: 'Identifiant',
    ...AddBeneficiaryWithFullDataClient.fieldLabels,
  },
})
export type EditBeneficiaryFullDataClient = typeof EditBeneficiaryFullDataClient
