import { z, ZodType } from 'zod'
import { SecurityRule, SecurityRuleGrantee } from '@mss/web/security/rules'
import {
  addMutationLogToBeneficiaryAnonymization,
  AnonymizationFunction,
} from '@mss/web/features/beneficiary/archiveBeneficiary/mutationLogAnonymization'
import { registerMutation } from '@mss/web/features/mutationClients'

type FieldLabels<T> = { [key in keyof T]: string }

export type CreateMutationClientOptions<
  Validation extends ZodType,
  Name extends string = string,
  Grantee extends SecurityRuleGrantee = SecurityRuleGrantee,
  Target = any,
  SecurityParameters = any,
  Input = z.infer<Validation>,
> = {
  // Unique identifier of the mutation
  name: Name
  // Humanly readable title, do not use to index, use name
  title: string
  inputValidation: Validation
  securityCheck: SecurityRule<Grantee, Target, SecurityParameters>
  beneficiaryAnonymization?: AnonymizationFunction<Input>
  fieldLabels: FieldLabels<Input>
}

export type MutationClient<
  Validation extends ZodType,
  Name extends string = string,
  Grantee extends SecurityRuleGrantee = SecurityRuleGrantee,
  Target = any,
  SecurityParameters = any,
> = CreateMutationClientOptions<
  Validation,
  Name,
  Grantee,
  Target,
  SecurityParameters,
  z.infer<Validation>
>

export const createMutationClient = <
  Validation extends ZodType,
  Name extends string = string,
  Grantee extends SecurityRuleGrantee = SecurityRuleGrantee,
  Target = any,
  SecurityParameters = any,
>(
  options: CreateMutationClientOptions<
    Validation,
    Name,
    Grantee,
    Target,
    SecurityParameters
  >,
): MutationClient<Validation, Name, Grantee, Target, SecurityParameters> => {
  // TODO Some runtime validation ?

  registerMutation(options)

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
