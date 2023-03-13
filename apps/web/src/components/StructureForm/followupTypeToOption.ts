import { MutationServerState } from '@mss/web/features/createMutation.server'
import { FollowupTypesForStructureCreation } from '@mss/web/features/structure/createStructure/createStructure.server'
import { EditStructureServer } from '@mss/web/features/structure/editStructure/editStructure.server'
import { Option } from '@mss/web/utils/options'

export const followupTypeToOption = (
  followupType:
    | MutationServerState<EditStructureServer>['followupTypes'][number]
    | FollowupTypesForStructureCreation[number],
): Option => {
  const { id, name } = followupType
  const usage =
    '_count' in followupType
      ? followupType._count.helpRequests + followupType._count.followups
      : 0

  if (usage === 0) {
    return {
      name,
      value: id,
    }
  }
  return {
    name: `${name} (${usage})`,
    value: id,
    disabled: true,
  }
}
