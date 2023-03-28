import { errorMessages } from '@mss/web/utils/zod'
import {
  HelpRequestReason,
  HelpRequestStatus,
  PaymentMethod,
} from '@prisma/client'
import { z } from 'zod'

const createHelpRequestSchema = z.object({
  beneficiaryId: z.string().uuid(),
  openingDate: z.date(errorMessages),
  type: z.string(errorMessages).uuid(),
  documents: z.array(z.string(), errorMessages).default([]),
  financialSupport: z.enum(['true', 'false']).nullish(),
  externalStructure: z.enum(['true', 'false']).nullish(),
  status: z.nativeEnum(HelpRequestStatus, errorMessages),
  askedAmount: z.number().min(0).nullish(),
  examinationDate: z.date(errorMessages).nullish(),
  decisionDate: z.date(errorMessages).nullish(),
  allocatedAmount: z.number().min(0).nullish(),
  paymentMethod: z.nativeEnum(PaymentMethod).nullish(),
  reason: z.nativeEnum(HelpRequestReason).nullish(),
  paymentDate: z.date(errorMessages).nullish(),
  handlingDate: z.date(errorMessages).nullish(),
  refusalReason: z.string().nullish(),
  prescribingOrganisation: z.string().nullish(),
  examiningOrganisation: z.string().nullish(),
  dispatchDate: z.date(errorMessages).nullish(),
  synthesis: z.string().nullish(),
  privateSynthesis: z.string().nullish(),
  dueDate: z.date(errorMessages).nullish(),
  fullFile: z.boolean().default(false),
})

const editHelpRequestSchema = createHelpRequestSchema.extend({
  helpRequestId: z.string().uuid(),
})

type CreateHelpRequestInput = z.infer<typeof createHelpRequestSchema>
type EditHelpRequestInput = z.infer<typeof editHelpRequestSchema>

export { createHelpRequestSchema, editHelpRequestSchema }

export type { CreateHelpRequestInput, EditHelpRequestInput }
