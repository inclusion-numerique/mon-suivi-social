import { canEditBeneficiaryFullInfo } from '@mss/web/security/rules'
import z from 'zod'
import { createMutationClient } from '@mss/web/features/createMutation.client'
import { AddBeneficiaryWithFullDataClient } from '@mss/web/features/beneficiary/addBeneficiary/addBeneficiaryWithFullData.client'

export const EditBeneficiaryFullDataClient = createMutationClient({
  name: 'beneficiary.editFullData',
  title: 'Modification de bénéficiaire',
  securityCheck: canEditBeneficiaryFullInfo,
  inputValidation: AddBeneficiaryWithFullDataClient.inputValidation
    .extend({
      beneficiaryId: z.string().uuid(),
    })
    .omit({ structureId: true }),
  beneficiaryAnonymization:
    AddBeneficiaryWithFullDataClient.beneficiaryAnonymization,
  fieldLabels: {
    beneficiaryId: 'Identifiant',
    ...AddBeneficiaryWithFullDataClient.fieldLabels,
  },
})

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type EditBeneficiaryFullDataClient = typeof EditBeneficiaryFullDataClient
