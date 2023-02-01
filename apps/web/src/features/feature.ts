import { SecurityRuleGrantee } from '@mss/web/security/rules'
import { Prisma } from '@prisma/client'
import { MutationDiff, MutationLogInfo } from '@mss/web/features/mutationLog'

export type MutationExecutor<Data, ServerState, MutationResult> =
  (mutationContext: {
    serverState: ServerState
    initialData: Data
    mutationData: Data
    diff: MutationDiff
    transaction: Prisma.TransactionClient
    user: SecurityRuleGrantee
  }) => Promise<MutationResult>

export type CreationMutationExecutor<Data, MutationResult> = (mutationContext: {
  mutationData: Data
  transaction: Prisma.TransactionClient
  user: SecurityRuleGrantee
  id: string
}) => Promise<MutationResult>

export type MutationContext = { user: SecurityRuleGrantee }
export type CreationMutationContext = { user: SecurityRuleGrantee; id: string }

export type MutationFeature<Data, SecurityParams, ServerState, MutationResult> =
  {
    securityCheck: (
      grantee: SecurityRuleGrantee,
      target: Data,
      params: SecurityParams,
    ) => boolean
    getServerState: (
      mutationData: Data,
      context: MutationContext,
    ) => Promise<ServerState> | ServerState
    dataFromServerState: (
      serverState: ServerState,
      context: MutationContext,
    ) => Data
    mutationLogInfo: (
      mutationData: Data,
      context: MutationContext,
    ) => MutationLogInfo
    executeMutation: MutationExecutor<Data, ServerState, MutationResult>
  }

export type CreationMutationFeature<Data, SecurityParams, MutationResult> = {
  securityCheck: (
    grantee: SecurityRuleGrantee,
    target: Data,
    params: SecurityParams,
  ) => boolean
  mutationLogInfo: (
    mutationData: Data,
    context: CreationMutationContext,
  ) => MutationLogInfo

  executeMutation: CreationMutationExecutor<Data, MutationResult>
}
