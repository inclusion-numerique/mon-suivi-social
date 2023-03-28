import { errorMessages } from '@mss/web/utils/zod'
import { StructureType } from '@prisma/client'
import { z } from 'zod'

const createStructureSchema = z.object({
  type: z.nativeEnum(StructureType),
  name: z.string(errorMessages).min(2, errorMessages.invalid_type_error),
  zipcode: z.string(errorMessages).min(5, errorMessages.invalid_type_error),
  city: z.string(errorMessages).min(2, errorMessages.invalid_type_error),
  address: z.string(errorMessages).min(2, errorMessages.invalid_type_error),
  phone: z.string(errorMessages).min(10, errorMessages.invalid_type_error),
  email: z.string(errorMessages).email(errorMessages.invalid_type_error),
  // Ids of the followupTypes to propose
  proposedFollowupTypes: z.array(z.string().uuid()),
})

const editStructureSchema = createStructureSchema.omit({ type: true }).extend({
  structureId: z.string().uuid(),
})

type CreateStructureInput = z.infer<typeof createStructureSchema>
type EditStructureInput = z.infer<typeof editStructureSchema>

export { createStructureSchema, editStructureSchema }

export type { CreateStructureInput, EditStructureInput }
