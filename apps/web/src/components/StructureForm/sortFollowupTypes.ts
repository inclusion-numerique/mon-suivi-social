import { MutationServerState } from '@mss/web/features/createMutation.server'
import { EditStructureServer } from '@mss/web/features/structure/editStructure/editStructure.server'

export const sortFollowupTypes = (
  initialValues: Set<string>,
  followupTypes: MutationServerState<EditStructureServer>['followupTypes'],
): MutationServerState<EditStructureServer>['followupTypes'] =>
  followupTypes.sort(
    (a, b) =>
      scoreFollowupTypeForSorting(initialValues, b) -
      scoreFollowupTypeForSorting(initialValues, a),
  )

const scoreFollowupTypeForSorting = (
  initialValues: Set<string>,
  followupType: MutationServerState<EditStructureServer>['followupTypes'][number],
): number => {
  if (followupType._count.helpRequests + followupType._count.followups > 0) {
    return 2
  }

  if (initialValues.has(followupType.id)) {
    return 1
  }

  return 0
}
