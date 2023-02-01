import { prismaClient } from '@mss/web/prismaClient'
import { detailedDiff, DetailedDiff } from 'deep-object-diff'

export type MutationLogInfo = Pick<
  Exclude<
    Parameters<typeof prismaClient.mutationLog.create>[0],
    undefined
  >['data'],
  | 'name'
  | 'targetUserId'
  | 'targetStructureId'
  | 'targetBeneficiaryId'
  | 'targetId'
>

export type MutationDiff = DetailedDiff

export const computeMutationDiff = <T extends Object>(
  initialData: T,
  mutationData: T,
): MutationDiff => detailedDiff(initialData, mutationData)
