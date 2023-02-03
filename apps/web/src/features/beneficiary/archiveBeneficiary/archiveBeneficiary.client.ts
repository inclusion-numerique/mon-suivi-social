import { canDeleteBeneficiary } from '@mss/web/security/rules'
import z from 'zod'
import { MutationLogInfo } from '@mss/web/features/mutationLog'
import { MutationClient, MutationContext } from '@mss/web/features/feature'
import { ArchiveBeneficiaryFeatureServer } from '@mss/web/features/beneficiary/archiveBeneficiary/archiveBeneficiary.server'

const securityCheck = canDeleteBeneficiary

export const name = 'structure.edit'

// TODO validation qui dépend du server state initial
const inputValidation = z.object({
  beneficiaryId: z.string().uuid(),
})

const mutationLogInfo = ({
  structureId,
  beneficiaryId,
}: MutationContext<
  ArchiveBeneficiaryFeatureClient.Input,
  ArchiveBeneficiaryFeatureServer.ServerState
>): MutationLogInfo => ({
  targetId: structureId,
  targetStructureId: structureId,
  targetBeneficiaryId: beneficiaryId,
})

const dataFromServerState = ({
  beneficiary: { id },
}: ArchiveBeneficiaryFeatureServer.ServerState): ArchiveBeneficiaryFeatureClient.Input => ({
  beneficiaryId: id,
})

export const ArchiveBeneficiaryFeatureClient = {
  name,
  securityCheck,
  inputValidation,
  dataFromServerState,
} satisfies MutationClient<
  ArchiveBeneficiaryFeatureClient.Input,
  {},
  ArchiveBeneficiaryFeatureServer.ServerState
>

export namespace ArchiveBeneficiaryFeatureClient {
  export type Validation = typeof inputValidation
  export type Input = z.infer<typeof inputValidation>
}
