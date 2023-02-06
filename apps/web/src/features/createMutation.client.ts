import { z, ZodType } from 'zod'
import { SecurityRule, SecurityRuleGrantee } from '@mss/web/security/rules'
import { addMutationLogToBeneficiaryAnonymization } from '@mss/web/features/beneficiary/archiveBeneficiary/mutationLogAnonymization'

type AnonymizationFunction<T> = (sensitiveDiff: T) => Partial<T>
type HumanizeInput<T> = { [key in keyof T]: string }

export type CreateMutationClientOptions<
  Validation extends ZodType,
  Name extends string = string,
  Grantee extends SecurityRuleGrantee = SecurityRuleGrantee,
  Target = any,
  SecurityParams = any,
  Input = z.infer<Validation>,
> = {
  name: Name
  inputValidation: Validation
  securityCheck: SecurityRule<Grantee, Target, SecurityParams>
  beneficiaryAnonymization?: AnonymizationFunction<Input>
  humanizeInput?: HumanizeInput<Input>
}

export type MutationClient<
  Validation extends ZodType,
  Name extends string = string,
  Grantee extends SecurityRuleGrantee = SecurityRuleGrantee,
  Target = any,
  SecurityParams = any,
  Input = z.infer<Validation>,
> = CreateMutationClientOptions<
  Validation,
  Name,
  Grantee,
  Target,
  SecurityParams
>

export const createMutationClient = <
  Validation extends ZodType,
  Name extends string = string,
  Grantee extends SecurityRuleGrantee = SecurityRuleGrantee,
  Target = any,
  SecurityParams = any,
>(
  options: CreateMutationClientOptions<
    Validation,
    Name,
    Grantee,
    Target,
    SecurityParams
  >,
): MutationClient<Validation, Name, Grantee, Target, SecurityParams> => {
  // TODO Some runtime validation ?

  if (options.beneficiaryAnonymization) {
    addMutationLogToBeneficiaryAnonymization(
      options.name,
      options.beneficiaryAnonymization,
    )
  }
  return options
}

// Helper types
export type MutationInput<T extends MutationClient<any, any, any, any>> =
  z.infer<T['inputValidation']>
