import { undefined, z, ZodType } from 'zod'
import { SecurityRuleGrantee } from '@mss/web/security/rules'
import {
  computeMutationDiff,
  MutationLogInfo,
} from '@mss/web/features/mutationLog'
import { Prisma } from '@prisma/client'
import { prismaClient } from '@mss/web/prismaClient'
import { forbiddenError } from '@mss/web/trpc/trpcErrors'
import { v4 } from 'uuid'
import { MutationClient } from '@mss/web/features/createMutation.client'

type GetServerState<GetServerStateInput, ServerState> = (
  getServerStateInput: GetServerStateInput,
) => Promise<ServerState>

type ExecuteMutation<Input, MutationResult> = (context: {
  user: SecurityRuleGrantee
  input: Input
  transaction: Prisma.TransactionClient
}) => Promise<MutationResult>

type ExecuteMutationWithServerState<ServerState, Input, MutationResult> =
  (context: {
    user: SecurityRuleGrantee
    initialInput: Input
    input: Input
    serverState: ServerState
    transaction: Prisma.TransactionClient
  }) => Promise<MutationResult>

// Mutation without initial state
export type CreateMutationServerOptions<
  Validation extends ZodType,
  Name extends string = string,
  Grantee extends SecurityRuleGrantee = SecurityRuleGrantee,
  Target = any,
  SecurityParams = any,
  AdditionalParams = any,
  MutationResult = any,
  Input = z.infer<Validation>,
> = {
  client: MutationClient<Validation, Name, Grantee, Target, SecurityParams>
  executeMutation: ExecuteMutation<Input, MutationResult>

  mutationLogInfo: (context: {
    input: Input
    result: MutationResult
    // TODO cleanup security context for log stuff and types
    structureId?: string
    beneficiaryId?: string
  }) => MutationLogInfo
}

export type CreateMutationServerWithInitialStateOptions<
  Validation extends ZodType,
  ServerState = any,
  GetServerStateInput = any,
  Name extends string = string,
  Grantee extends SecurityRuleGrantee = SecurityRuleGrantee,
  Target = any,
  SecurityParams = any,
  AdditionalParams = any,
  MutationResult = any,
  Input = z.infer<Validation>,
> = Omit<
  CreateMutationServerOptions<
    Validation,
    Name,
    Grantee,
    Target,
    SecurityParams,
    AdditionalParams,
    MutationResult,
    Input
  >,
  'executeMutation' | 'mutationLogInfo'
> & {
  getServerState: GetServerState<GetServerStateInput, ServerState>
  dataFromServerState: (serverState: ServerState) => Input
  executeMutation: ExecuteMutationWithServerState<
    ServerState,
    Input,
    MutationResult
  >
  mutationLogInfo: (context: {
    input: Input
    serverState: ServerState
    result: MutationResult
    // TODO cleanup security context for log stuff and types
    structureId?: string
    beneficiaryId?: string
  }) => MutationLogInfo
}

export type MutationServer<
  Validation extends ZodType,
  Name extends string = string,
  Grantee extends SecurityRuleGrantee = SecurityRuleGrantee,
  Target = any,
  SecurityParams = any,
  AdditionalParams = any,
  MutationResult = any,
  Input = z.infer<Validation>,
> = Readonly<
  Omit<
    CreateMutationServerOptions<
      Validation,
      Name,
      Grantee,
      Target,
      SecurityParams,
      AdditionalParams,
      MutationResult,
      Input
    >,
    'executeMutation'
  >
> & {
  execute: (context: {
    input: Input
    user: Grantee
    target: Target
    securityParams: SecurityParams
    // TODO cleanup security context for log stuff and types
    structureId?: string
    beneficiaryId?: string
  }) => Promise<MutationResult>
}

export type MutationServerWithInitialState<
  Validation extends ZodType,
  ServerState = any,
  GetServerStateInput = any,
  Name extends string = string,
  Grantee extends SecurityRuleGrantee = SecurityRuleGrantee,
  Target = any,
  SecurityParams = any,
  AdditionalParams = any,
  MutationResult = any,
  Input = z.infer<Validation>,
> = Readonly<
  Omit<
    CreateMutationServerWithInitialStateOptions<
      Validation,
      ServerState,
      GetServerStateInput,
      Name,
      Grantee,
      Target,
      SecurityParams,
      AdditionalParams,
      MutationResult,
      Input
    >,
    'executeMutation'
  >
> & {
  execute: (context: {
    input: Input
    user: Grantee
    target: Target
    securityParams: SecurityParams
    getServerStateInput: GetServerStateInput
    // TODO cleanup security context for log stuff and types
    structureId?: string
    beneficiaryId?: string
  }) => Promise<MutationResult>
}

export const createMutationServer = <
  Validation extends ZodType,
  Name extends string = string,
  Grantee extends SecurityRuleGrantee = SecurityRuleGrantee,
  Target = any,
  SecurityParams = any,
  AdditionalParams = any,
  MutationResult = any,
  Input = z.infer<Validation>,
>(
  options: CreateMutationServerOptions<
    Validation,
    Name,
    Grantee,
    Target,
    SecurityParams,
    AdditionalParams,
    MutationResult,
    Input
  >,
): MutationServer<
  Validation,
  Name,
  Grantee,
  Target,
  SecurityParams,
  AdditionalParams,
  MutationResult,
  Input
> => {
  // TODO Some runtime validation ?
  // TODO merge stuff ?

  const execute = async ({
    input,
    user,
    target,
    securityParams,
    structureId,
    beneficiaryId,
  }: {
    input: Input
    user: Grantee
    target: Target
    securityParams: SecurityParams
    structureId?: string
    beneficiaryId?: string
  }) => {
    if (!options.client.securityCheck(user, target, securityParams)) {
      throw forbiddenError()
    }

    const diff = computeMutationDiff({}, input as object) as Prisma.JsonObject

    return prismaClient.$transaction(async (transaction) => {
      const result = await options.executeMutation({
        user,
        input,
        transaction,
      })

      await transaction.mutationLog.create({
        data: {
          name: options.client.name,
          id: v4(),
          byId: user.id,
          diff,
          ...options.mutationLogInfo({
            structureId,
            beneficiaryId,
            input,
            result,
          }),
        },
      })
      return result
    })
  }

  return { ...options, execute }
}

export const createMutationServerWithInitialState = <
  Validation extends ZodType,
  ServerState = any,
  GetServerStateInput = any,
  Name extends string = string,
  Grantee extends SecurityRuleGrantee = SecurityRuleGrantee,
  Target = any,
  SecurityParams = any,
  AdditionalParams = any,
  MutationResult = any,
  Input = z.infer<Validation>,
>(
  options: CreateMutationServerWithInitialStateOptions<
    Validation,
    ServerState,
    GetServerStateInput,
    Name,
    Grantee,
    Target,
    SecurityParams,
    AdditionalParams,
    MutationResult,
    Input
  >,
): MutationServerWithInitialState<
  Validation,
  ServerState,
  GetServerStateInput,
  Name,
  Grantee,
  Target,
  SecurityParams,
  AdditionalParams,
  MutationResult,
  Input
> => {
  // TODO Some runtime validation ?
  // TODO factorize server creation with conditional types instead of 2 methods

  const execute = async ({
    input,
    user,
    target,
    securityParams,
    getServerStateInput,
    structureId,
    beneficiaryId,
  }: {
    input: Input
    user: Grantee
    target: Target
    securityParams: SecurityParams
    getServerStateInput: GetServerStateInput
    structureId?: string
    beneficiaryId?: string
  }) => {
    if (!options.client.securityCheck(user, target, securityParams)) {
      throw forbiddenError()
    }

    const serverState = options.getServerState
      ? await options.getServerState(getServerStateInput)
      : (undefined as ServerState)

    const initialInput = options.dataFromServerState(serverState)

    const diff = computeMutationDiff(
      initialInput as object,
      input as object,
    ) as Prisma.JsonObject

    return prismaClient.$transaction(async (transaction) => {
      const result = await options.executeMutation({
        serverState,
        initialInput,
        user,
        input,
        transaction,
      })

      await transaction.mutationLog.create({
        data: {
          name: options.client.name,
          id: v4(),
          byId: user.id,
          diff,
          ...options.mutationLogInfo({
            structureId,
            serverState,
            beneficiaryId,
            input,
            result,
          }),
        },
      })
      return result
    })
  }

  return { ...options, execute }
}

// Helper types
export type MutationResult<T extends MutationServer<any, any, any, any>> =
  Awaited<ReturnType<T['execute']>>

export type MutationServerState<
  T extends { getServerState: GetServerState<any, any> },
> = Awaited<ReturnType<T['getServerState']>>
