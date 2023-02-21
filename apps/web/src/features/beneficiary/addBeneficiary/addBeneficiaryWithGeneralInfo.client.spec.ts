import { AddBeneficiaryWithGeneralInfoClient } from '@mss/web/features/beneficiary/addBeneficiary/addBeneficiaryWithGeneralInfo.client'
import { v4 } from 'uuid'
import { BeneficiaryStatus } from '@prisma/client'
import { MutationInput } from '@mss/web/features/createMutation.client'

describe('addBeneficiaryWithGeneralInfo Client', () => {
  describe('inputValidation', () => {
    it('Validates empty input', () => {
      const input = {
        structureId: v4(),
        referents: [v4()],
        status: BeneficiaryStatus.Active,
        noPhone: false,
        caregiver: false,
        aidantConnectAuthorized: false,
      } satisfies MutationInput<AddBeneficiaryWithGeneralInfoClient>

      const result =
        AddBeneficiaryWithGeneralInfoClient.inputValidation.safeParse(input)

      expect(result.success).toBeTrue()
    })
  })
})
