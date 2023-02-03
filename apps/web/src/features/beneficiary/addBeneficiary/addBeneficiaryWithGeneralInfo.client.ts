import { canCreateBeneficiaryWithGeneralInfo } from '@mss/web/security/rules'
import z from 'zod'
import { MutationLogInfo } from '@mss/web/features/mutationLog'
import { CreationMutationContext } from '@mss/web/features/feature'
import { addMutationLogToBeneficiaryAnonymization } from '@mss/web/features/beneficiary/archiveBeneficiary/mutationLogAnonymization'

const name = 'beneficiary.addWithGeneralInfo'

const securityCheck = canCreateBeneficiaryWithGeneralInfo

// TODO validation qui dépend du server state initial
const inputValidation = z.object({
  structureId: z.string(),
  firstName: z.string(),
})

const mutationLogInfo = ({
  id,
  input: { structureId },
}: CreationMutationContext<AddBeneficiaryWithGeneralInfoFeatureClient.Input>): MutationLogInfo => ({
  targetId: structureId,
  targetStructureId: structureId,
  targetBeneficiaryId: id,
})

addMutationLogToBeneficiaryAnonymization(
  name,
  ({
    firstName,
    structureId,
  }: Partial<AddBeneficiaryWithGeneralInfoFeatureClient.Input>) =>
    ({
      structureId,
      firstName: '',
    } as AddBeneficiaryWithGeneralInfoFeatureClient.Input),
)

export const AddBeneficiaryWithGeneralInfoFeatureClient = {
  name,
  securityCheck,
  mutationLogInfo,
  inputValidation,
}

export namespace AddBeneficiaryWithGeneralInfoFeatureClient {
  export type Input = z.infer<typeof inputValidation>
}
