import { canEditStructure } from '@mss/web/security/rules'
import z from 'zod'
import type { EditStructureFeatureServer } from '@mss/web/features/structure/editStructure/editStructure.server'
import { MutationLogInfo } from '@mss/web/features/mutationLog'
import { MutationClient, MutationContext } from '@mss/web/features/feature'

const securityCheck = canEditStructure

const name = 'structure.edit'

// TODO validation qui dépend du server state initial
const inputValidation = z.object({
  structureId: z.string().uuid(),
  name: z.string().min(2),
  zipcode: z.string().min(5),
  city: z.string().min(2),
  address: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email(),
  // Ids of the followupTypes to propose
  proposedFollowupTypes: z.array(z.string().uuid()),
})

const dataFromServerState = ({
  structure: {
    id,
    name,
    address,
    zipcode,
    city,
    phone,
    email,
    proposedFollowupTypes,
  },
}: EditStructureFeatureServer.ServerState): EditStructureFeatureClient.Input => ({
  structureId: id,
  name,
  address,
  zipcode,
  city,
  phone,
  email,
  proposedFollowupTypes: proposedFollowupTypes.map(
    ({ followupTypeId }) => followupTypeId,
  ),
})

const mutationLogInfo = ({
  input: { structureId },
}: MutationContext<
  EditStructureFeatureClient.Input,
  EditStructureFeatureClient.ServerState
>): MutationLogInfo => ({
  targetId: structureId,
  targetStructureId: structureId,
})

export const EditStructureFeatureClient = {
  name,
  securityCheck,
  inputValidation,
  dataFromServerState,
  mutationLogInfo,
} satisfies MutationClient<
  EditStructureFeatureClient.Input,
  {},
  EditStructureFeatureServer.ServerState
>

export namespace EditStructureFeatureClient {
  export type Input = z.infer<typeof inputValidation>
  export type ServerState = EditStructureFeatureServer.ServerState
}
