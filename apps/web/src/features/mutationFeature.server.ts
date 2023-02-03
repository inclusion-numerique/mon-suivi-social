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
  Input,
  SecurityParams,
  ServerState,
  MutationResult,
>(
  {
    user,
    input,
    securityParams,
    structureId,
    beneficiaryId,
  }: {
    user: SecurityRuleGrantee
    input: Input
    securityParams: SecurityParams
    structureId?: string
    beneficiaryId?: string
  },
  feature: MutationFeature<Input, SecurityParams, ServerState, MutationResult>,
) => {
  if (!feature.securityCheck(user, input, securityParams)) {
    throw forbiddenError()
  }

  const serverState = await feature.getServerState(input, { user })
  const initialInput = feature.dataFromServerState(serverState, { user })

  const diff = computeMutationDiff(initialInput as Object, input as Object)

  return prismaClient.$transaction((transaction) =>
    Promise.all([
      feature.executeMutation({
        serverState,
        initialInput,
        diff,
        user,
        input,
        transaction,
      }),
      transaction.mutationLog.create({
        data: {
          id: v4(),
          byId: user.id,
          diff: JSON.stringify(diff),
          ...feature.mutationLogInfo({
            user,
            structureId,
            serverState,
            beneficiaryId,
            input,
          }),
        },
      }),
    ]).then(([result]) => result),
  )
}

// I didn't succeed in making the types more generic to merge the definitions of mutations and creations but I'm sure there is a way
export const executeCreationMutation = async <
  Input,
  SecurityParams,
  MutationResult,
>(
  {
    user,
    input,
    securityParams,
  }: {
    user: SecurityRuleGrantee
    input: Input
    securityParams: SecurityParams
  },
  feature: CreationMutationFeature<Input, SecurityParams, MutationResult>,
) => {
  // Id representing the created object
  const id = v4()

  if (!feature.securityCheck(user, input, securityParams)) {
    throw forbiddenError()
  }
  const diff = computeMutationDiff({}, input as Object)

  return prismaClient.$transaction((transaction) =>
    Promise.all([
      feature.executeMutation({
        user,
        input,
        transaction,
        id,
      }),
      transaction.mutationLog.create({
        data: {
          id: v4(),
          byId: user.id,
          diff: JSON.stringify(diff),
          ...feature.mutationLogInfo(input, { user, id }),
        },
      }),
    ]).then(([result]) => result),
  )
}
