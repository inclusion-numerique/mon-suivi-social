import { prismaClient } from '@mss/web/prismaClient'
import { detailedDiff, DetailedDiff } from 'deep-object-diff'

export type MutationLogInfo = Pick<
  Exclude<
    Parameters<typeof prismaClient.mutationLog.create>[0],
    undefined
  >['data'],
  'targetUserId' | 'targetStructureId' | 'targetBeneficiaryId' | 'targetId'
>

export type MutationDiff = DetailedDiff

export const computeMutationDiff = <T extends Object>(
  initialInput: T,
  input: T,
): MutationDiff => detailedDiff(initialInput, input)
