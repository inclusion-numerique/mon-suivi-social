import { SecurityRuleGrantee } from '@mss/web/security/rules'
import { Prisma } from '@prisma/client'
import { MutationDiff, MutationLogInfo } from '@mss/web/features/mutationLog'
import { z, ZodType } from 'zod'

// A Mutation is a feature that aims to modify server state

// A mutation client can be used in browser and in server context
export type MutationClient<Input, SecurityParams, ServerState> = {
  name: string
  inputValidation: ZodType
  securityCheck: (
    grantee: SecurityRuleGrantee,
    target: Input,
    params: SecurityParams,
  ) => boolean
  dataFromServerState: (
    serverState: ServerState,
    context: MutationContext<Input, ServerState>,
  ) => Input
  mutationLogInfo: (
    context: MutationContext<Input, ServerState>,
  ) => MutationLogInfo
}

// A mutation server can be used only in server context with database/third party APIs access
export type MutationServer<Input, ServerState, MutationResult> = {
  getServerState: (
    input: Input,
    context: MutationContext<Input, ServerState>,
  ) => Promise<ServerState> | ServerState
  executeMutation: MutationExecutor<Input, ServerState, MutationResult>
}

export type MutationFeature<
  Input,
  SecurityParams,
  ServerState,
  MutationResult,
> = MutationClient<Input, SecurityParams, ServerState> &
  MutationServer<Input, ServerState, MutationResult>

export type MutationExecutor<Input, ServerState, MutationResult> =
  (mutationContext: {
    serverState: ServerState
    initialInput: Input
    input: Input
    diff: MutationDiff
    transaction: Prisma.TransactionClient
    user: SecurityRuleGrantee
  }) => Promise<MutationResult>
export type MutationContext<Input, ServerState> = {
  input: Input
  serverState: ServerState
  user: SecurityRuleGrantee
  structureId?: string
  beneficiaryId?: string
}

// A feature that aims to create a new object/objects in server state
export type CreationMutationFeature<Input, SecurityParams, MutationResult> = {
  name: string
  securityCheck: (
    grantee: SecurityRuleGrantee,
    target: Input,
    params: SecurityParams,
  ) => boolean
  mutationLogInfo: (context: CreationMutationContext<Input>) => MutationLogInfo

  executeMutation: CreationMutationExecutor<Input, MutationResult>
}
export type CreationMutationExecutor<Input, MutationResult> =
  (mutationContext: {
    input: Input
    transaction: Prisma.TransactionClient
    user: SecurityRuleGrantee
    id: string
  }) => Promise<MutationResult>
export type CreationMutationContext<Input> = {
  input: Input
  user: SecurityRuleGrantee
  id: string
  structureId?: string
  beneficiaryId?: string
}

// A Query feature that provides information to a user
export type QueryFeature<Input, SecurityParams, QueryResult> = {
  securityCheck: (
    grantee: SecurityRuleGrantee,
    target: Input,
    params: SecurityParams,
  ) => boolean
  executeQuery: QueryExecutor<Input, QueryResult>
}

export type QueryExecutor<Input, QueryResult> = (mutationContext: {
  queryInput: Input
  transaction: Prisma.TransactionClient
  user: SecurityRuleGrantee
  id: string
}) => Promise<QueryResult>
