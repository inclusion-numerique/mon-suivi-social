import { z } from 'zod'

const createFollowupTypeSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Veuillez renseigner le nom de l'accompagnement",
    })
    .trim()
    .min(2, 'Veuillez renseigner au minimum 2 caractères'),
  structureId: z.string().uuid(),
})

type CreateFollowupTypeInput = z.infer<typeof createFollowupTypeSchema>

export { createFollowupTypeSchema }

export type { CreateFollowupTypeInput }
