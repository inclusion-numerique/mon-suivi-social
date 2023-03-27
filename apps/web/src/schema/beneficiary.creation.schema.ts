import { errorMessages } from '@mss/web/utils/zod'
import { BeneficiaryTitle, Gender } from '@prisma/client'
import { z } from 'zod'

const beneficiaryCreationSchema = z.object({
  structureId: z.string().uuid(),
  referents: z
    .array(z.string().uuid(), {
      required_error: 'Veuillez renseigner au moins un agent référent',
    })
    .min(1, 'Veuillez renseigner au moins un agent référent'),
  aidantConnectAuthorized: z.boolean().default(false),
  title: z.nativeEnum(BeneficiaryTitle).nullish(),
  firstName: z.string().nullish(),
  usualName: z.string().nullish(),
  birthName: z.string().nullish(),
  birthDate: z.date(errorMessages).nullish(),
  birthPlace: z.string().nullish(),
  deathDate: z.date(errorMessages).nullish(),
  gender: z.nativeEnum(Gender).nullish(),
  street: z.string().nullish(),
  streetNumber: z.string().nullish(),
  addressComplement: z.string().nullish(),
  zipcode: z.string().nullish(),
  city: z.string().nullish(),
  region: z.string().nullish(),
  noPhone: z.boolean().default(false),
  phone1: z.string().nullish(),
  email: z.string().email().nullish(),
})

type BeneficiaryCreationInput = z.infer<typeof beneficiaryCreationSchema>

export { beneficiaryCreationSchema }

export type { BeneficiaryCreationInput }
