import { z, ZodType } from 'zod'
import { SecurityRuleGrantee } from '@mss/web/security/rules'
import { PrismaClient } from '@prisma/client'
import { prismaClient } from '@mss/web/prismaClient'
import { forbiddenError } from '@mss/web/trpc/trpcErrors'
import { QueryClient } from '@mss/web/features/createQuery.client'

type ExecuteQuery<Input, QueryResult> = (context: {
  user: SecurityRuleGrantee
  input: Input
  prisma: PrismaClient
}) => Promise<QueryResult>

export type CreateQueryServerOptions<
  QueryResult,
  Validation extends ZodType,
  SecurityParameters,
  Name extends string = string,
  AdditionalParameters = any,
  Input = z.infer<Validation>,
> = {
  client: QueryClient<Validation, SecurityParameters, Name>
  executeQuery: ExecuteQuery<Input, QueryResult>
}

export type QueryServer<
  QueryResult,
  Validation extends ZodType,
  SecurityParameters,
  Name extends string = string,
  AdditionalParameters = any,
  Input = z.infer<Validation>,
> = Readonly<
  Omit<
    CreateQueryServerOptions<
      QueryResult,
      Validation,
      SecurityParameters,
      Name,
      AdditionalParameters
    >,
    'executeQuery'
  > & {
    execute: (context: {
      input: Input
      user: SecurityRuleGrantee
      securityParams: SecurityParameters
    }) => Promise<QueryResult>
  }
>

export const createQueryServer = <
  QueryResult,
  Validation extends ZodType,
  SecurityParameters,
  Name extends string = string,
  AdditionalParameters = any,
  Input = z.infer<Validation>,
>(
  options: CreateQueryServerOptions<
    QueryResult,
    Validation,
    SecurityParameters,
    Name,
    AdditionalParameters
  >,
): QueryServer<
  QueryResult,
  Validation,
  SecurityParameters,
  Name,
  AdditionalParameters
> => {
  const execute = ({
    input,
    user,
    securityParams,
  }: {
    input: Input
    user: SecurityRuleGrantee
    securityParams: SecurityParameters
  }) => {
    if (!options.client.securityCheck(user, input, securityParams)) {
      throw forbiddenError()
    }

    return options.executeQuery({
      input,
      user,
      prisma: prismaClient,
    })
  }

  return { ...options, execute }
}

// Helper types
export type QueryResult<T extends QueryServer<any, any, any, any>> = Awaited<
  ReturnType<T['execute']>
>

// Helper types
export type QueryInput<T extends QueryClient<any, any, any, any>> = z.infer<
  T['inputValidation']
>
