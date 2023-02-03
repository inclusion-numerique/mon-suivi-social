import { canEditStructure } from '@mss/web/security/rules'
import z from 'zod'
import { MutationLogInfo } from '@mss/web/features/mutationLog'
import { CreationMutationContext } from '@mss/web/features/feature'

const name = 'structure.createFollowupType'

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

const mutationLogInfo = ({
  id,
  input: { structureId },
}: CreationMutationContext<CreateFollowupTypeFeatureClient.Input>): MutationLogInfo => ({
  targetId: id,
  targetStructureId: structureId,
})

export const CreateFollowupTypeFeatureClient = {
  name,
  securityCheck,
  inputValidation,
  mutationLogInfo,
}

export namespace CreateFollowupTypeFeatureClient {
  export type Input = z.infer<typeof inputValidation>
}
