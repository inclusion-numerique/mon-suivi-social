import { canListBeneficiaries } from '@mss/web/security/rules'
import z from 'zod'

const securityCheck = canListBeneficiaries

const inputValidation = z.object({
  structureId: z.string().uuid(),
  search: z.string().trim().optional(),
  take: z.number().int().gt(0),
  skip: z.number().int().gte(0),
  sortBy: z.array(z.object({})).optional(),
})

export const ListBeneficiariesFeatureClient = {
  securityCheck,
  inputValidation,
}

export namespace ListBeneficiariesFeatureClient {
  export type Input = z.infer<typeof inputValidation>
}
