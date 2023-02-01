import { SecurityRuleGrantee } from '@mss/web/security/rules'
import {
  CreationMutationFeature,
  MutationFeature,
} from '@mss/web/features/feature'
import { forbiddenError } from '@mss/web/trpc/trpcErrors'
import { prismaClient } from '@mss/web/prismaClient'
import { v4 } from 'uuid'
import { computeMutationDiff } from '@mss/web/features/mutationLog'

export const executeMutation = async <
  Data,
  SecurityParams,
  ServerState,
  MutationResult,
>(
  {
    user,
    mutationData,
    securityParams,
  }: {
    user: SecurityRuleGrantee
    mutationData: Data
    securityParams: SecurityParams
  },
  feature: MutationFeature<Data, SecurityParams, ServerState, MutationResult>,
) => {
  if (!feature.securityCheck(user, mutationData, securityParams)) {
    throw forbiddenError()
  }

  const serverState = await feature.getServerState(mutationData, { user })
  const initialData = feature.dataFromServerState(serverState, { user })

  const diff = computeMutationDiff(
    initialData as Object,
    mutationData as Object,
  )

  return prismaClient.$transaction((transaction) =>
    Promise.all([
      feature.executeMutation({
        serverState,
        initialData,
        diff,
        user,
        mutationData,
        transaction,
      }),
      transaction.mutationLog.create({
        data: {
          id: v4(),
          byId: user.id,
          diff: JSON.stringify(diff),
          ...feature.mutationLogInfo(mutationData, { user }),
        },
      }),
    ]).then(([result]) => result),
  )
}

// I didn't succeed in making the types more generic to merge the definitions of mutations and creations but I'm sure there is a way
export const executeCreationMutation = async <
  Data,
  SecurityParams,
  MutationResult,
>(
  {
    user,
    mutationData,
    securityParams,
  }: {
    user: SecurityRuleGrantee
    mutationData: Data
    securityParams: SecurityParams
  },
  feature: CreationMutationFeature<Data, SecurityParams, MutationResult>,
) => {
  // Id representing the created object
  const id = v4()

  if (!feature.securityCheck(user, mutationData, securityParams)) {
    throw forbiddenError()
  }
  const diff = computeMutationDiff({}, mutationData as Object)

  return prismaClient.$transaction((transaction) =>
    Promise.all([
      feature.executeMutation({
        user,
        mutationData,
        transaction,
        id,
      }),
      transaction.mutationLog.create({
        data: {
          id: v4(),
          byId: user.id,
          diff: JSON.stringify(diff),
          ...feature.mutationLogInfo(mutationData, { user, id }),
        },
      }),
    ]).then(([result]) => result),
  )
}
