import { canEditStructure } from '@mss/web/security/rules'
import z from 'zod'

const securityCheck = canEditStructure

const inputValidation = z.object({
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
  inputValidation,
}

export namespace CreateFollowupTypeFeatureClient {
  export type Input = z.infer<typeof inputValidation>
}
