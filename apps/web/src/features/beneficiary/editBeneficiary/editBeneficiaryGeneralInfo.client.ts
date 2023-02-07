import { canEditBeneficiaryGeneralInfo } from '@mss/web/security/rules'
import z from 'zod'
import { createMutationClient } from '@mss/web/features/createMutation.client'
import { AddBeneficiaryWithGeneralInfoClient } from '@mss/web/features/beneficiary/addBeneficiary/addBeneficiaryWithGeneralInfo.client'

export const EditBeneficiaryGeneralInfoClient = createMutationClient({
  name: 'beneficiary.editGeneralInfo',
  securityCheck: canEditBeneficiaryGeneralInfo,
  inputValidation: AddBeneficiaryWithGeneralInfoClient.inputValidation.extend({
    beneficiaryId: z.string().uuid(),
  }),
  beneficiaryAnonymization:
    AddBeneficiaryWithGeneralInfoClient.beneficiaryAnonymization,
  fieldLabels: {
    beneficiaryId: 'Identifiant',
    ...AddBeneficiaryWithGeneralInfoClient.fieldLabels,
  },
})
export type EditBeneficiaryGeneralInfoClient =
  typeof EditBeneficiaryGeneralInfoClient
