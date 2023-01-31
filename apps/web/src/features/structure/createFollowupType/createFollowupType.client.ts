import { canEditStructure } from '@mss/web/security/rules'
import z from 'zod'

const securityCheck = canEditStructure

const dataValidation = z.object({
  name: z
    .string({
      invalid_type_error: "Veuillez renseigner le nom de l'accompagnement",
    })
    .trim()
    .min(2, 'Veuillez renseigner au minimum 2 caractères'),
  structureId: z.string().uuid(),
})

export const CreateFollowupTypeFeatureClient = {
  securityCheck,
  dataValidation,
}

export namespace CreateFollowupTypeFeatureClient {
  export type Data = z.infer<typeof dataValidation>
}
