import { SessionUser } from '@mss/web/auth/sessionUser'
import { createBeneficiary } from '@mss/web/server/query/beneficiaires/createBeneficiary'
import { BeneficiaryCreationInput } from '@mss/web/server/schema'

export const createBeneficiaryHandler = async ({
  input,
  user,
}: {
  input: BeneficiaryCreationInput
  user: SessionUser
}) => {
  const beneficiary = await createBeneficiary(input, user)

  return beneficiary
}
