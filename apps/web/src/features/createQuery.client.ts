import { z, ZodType } from 'zod'
import { SecurityRuleGrantee } from '@mss/web/security/rules'

export type CreateQueryClientOptions<
  Validation extends ZodType,
  SecurityParams = any,
  Name extends string = string,
  Input = z.infer<Validation>,
> = {
  name: Name
  inputValidation: Validation
  securityCheck: (
    grantee: SecurityRuleGrantee,
    target: Input,
    params: SecurityParams,
  ) => boolean
}

export type QueryClient<
  Validation extends ZodType,
  SecurityParams = any,
  Name extends string = string,
  Input = z.infer<Validation>,
> = CreateQueryClientOptions<Validation, SecurityParams, Name>

export const createQueryClient = <
  Validation extends ZodType,
  SecurityParams,
  Name extends string = string,
>(
  options: CreateQueryClientOptions<Validation, SecurityParams, Name>,
): QueryClient<Validation, SecurityParams, Name> => {
  // TODO Some runtime validation or register it somewhere to list ? ?
  return options
}

// Helper types
export type QueryInput<T extends QueryClient<any, any, any, any>> = z.infer<
  T['inputValidation']
>
