import { canEditStructure } from '@mss/web/security/rules'
import z from 'zod'
import { StructureType } from '@prisma/client'
import type { EditStructureFeatureServer } from '@mss/web/features/editStructure/editStructure.server'

const securityCheck = canEditStructure

const dataValidation = z.object({
  id: z.string().uuid().optional(),
  type: z.nativeEnum(StructureType),
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
    type,
    address,
    zipcode,
    city,
    phone,
    email,
    proposedFollowupTypes,
  },
}: EditStructureFeatureServer.ServerState): EditStructureFeatureClient.Data => ({
  id,
  name,
  type,
  address,
  zipcode,
  city,
  phone,
  email,
  proposedFollowupTypes: proposedFollowupTypes.map(
    ({ followupTypeId }) => followupTypeId,
  ),
})

export const EditStructureFeatureClient = {
  securityCheck,
  dataValidation,
  dataFromServerState,
}

export namespace EditStructureFeatureClient {
  export type Data = z.infer<typeof dataValidation>
  export type ServerState = EditStructureFeatureServer.ServerState
}
