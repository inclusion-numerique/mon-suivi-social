import { prismaClient } from '@mss/web/prismaClient'
import { detailedDiff, DetailedDiff } from 'deep-object-diff'
import { removeNullUndefinedAndEmptyValues } from '@mss/web/utils/removeNullUndefinedAndEmptyValues'

export type MutationLogInfo = Pick<
  Exclude<
    Parameters<typeof prismaClient.mutationLog.create>[0],
    undefined
  >['data'],
  'targetUserId' | 'targetStructureId' | 'targetBeneficiaryId' | 'targetId'
>

export type MutationDiff = {
  [index in keyof DetailedDiff]: Record<string, unknown>
}

// Computes a added, updated and deleted diff between two inputs, considering that undefined and null are "deleted" values
export const computeMutationDiff = <T extends object>(
  initialInput: T,
  input: T,
): MutationDiff => {
  const cleanInitial = removeNullUndefinedAndEmptyValues(initialInput)
  const cleanInput = removeNullUndefinedAndEmptyValues(input)
  const diff = detailedDiff(cleanInitial, cleanInput)

  // detailedDiff put undefined as a value for every deleted key.
  // we historize the deleted value instead, so the object is storable, instead of the keys
  // being removed by serialization process
  for (const key of Object.keys(diff.deleted)) ((diff.deleted as Record<string, unknown>)[key] =
        (cleanInitial as Record<string, unknown>)[key] ?? null)
  

  return diff as MutationDiff
}
