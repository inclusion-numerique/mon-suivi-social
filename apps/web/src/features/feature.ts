import { SecurityRuleGrantee } from '@mss/web/security/rules'
import { Prisma } from '@prisma/client'
import { MutationDiff, MutationLogInfo } from '@mss/web/features/mutationLog'

export type MutationExecutor<Input, ServerState, MutationResult> =
  (mutationContext: {
    serverState: ServerState
    initialInput: Input
    input: Input
    diff: MutationDiff
    transaction: Prisma.TransactionClient
    user: SecurityRuleGrantee
  }) => Promise<MutationResult>

export type CreationMutationExecutor<Input, MutationResult> =
  (mutationContext: {
    input: Input
    transaction: Prisma.TransactionClient
    user: SecurityRuleGrantee
    id: string
  }) => Promise<MutationResult>

export type MutationContext = { user: SecurityRuleGrantee }
export type CreationMutationContext = { user: SecurityRuleGrantee; id: string }

export type MutationFeature<
  Input,
  SecurityParams,
  ServerState,
  MutationResult,
> = {
  securityCheck: (
    grantee: SecurityRuleGrantee,
    target: Input,
    params: SecurityParams,
  ) => boolean
  getServerState: (
    input: Input,
    context: MutationContext,
  ) => Promise<ServerState> | ServerState
  dataFromServerState: (
    serverState: ServerState,
    context: MutationContext,
  ) => Input
  mutationLogInfo: (input: Input, context: MutationContext) => MutationLogInfo
  executeMutation: MutationExecutor<Input, ServerState, MutationResult>
}

export type CreationMutationFeature<Input, SecurityParams, MutationResult> = {
  securityCheck: (
    grantee: SecurityRuleGrantee,
    target: Input,
    params: SecurityParams,
  ) => boolean
  mutationLogInfo: (
    input: Input,
    context: CreationMutationContext,
  ) => MutationLogInfo

  executeMutation: CreationMutationExecutor<Input, MutationResult>
}
export type QueryExecutor<Input, QueryResult> = (mutationContext: {
  queryInput: Input
  transaction: Prisma.TransactionClient
  user: SecurityRuleGrantee
  id: string
}) => Promise<QueryResult>

export type QueryFeature<Input, SecurityParams, QueryResult> = {
  securityCheck: (
    grantee: SecurityRuleGrantee,
    target: Input,
    params: SecurityParams,
  ) => boolean
  executeQuery: CreationMutationExecutor<Input, QueryResult>
}
