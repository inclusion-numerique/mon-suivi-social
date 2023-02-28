import { z, ZodType } from 'zod'
import { SecurityRuleGrantee } from '@mss/web/security/rules'

export type CreateQueryClientOptions<
  Validation extends ZodType,
  SecurityParameters = any,
  Name extends string = string,
  Input = z.infer<Validation>,
> = {
  name: Name
  inputValidation: Validation
  securityCheck: (
    grantee: SecurityRuleGrantee,
    target: Input,
    parameters: SecurityParameters,
  ) => boolean
}

export type QueryClient<
  Validation extends ZodType,
  SecurityParameters = any,
  Name extends string = string,
  Input = z.infer<Validation>,
> = CreateQueryClientOptions<Validation, SecurityParameters, Name>

export const createQueryClient = <
  Validation extends ZodType,
  SecurityParameters,
  Name extends string = string,
>(
  options: CreateQueryClientOptions<Validation, SecurityParameters, Name>,
): QueryClient<Validation, SecurityParameters, Name> => 
  // TODO Some runtime validation or register it somewhere to list ? ?
   options


// Helper types
export type QueryInput<T extends QueryClient<any, any, any, any>> = z.infer<
  T['inputValidation']
>
