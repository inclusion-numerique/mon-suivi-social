import { prismaClient } from '@mss/web/src/prismaClient'
import { fixtureStructure } from './structures'
import {
  fixturesDefaultFollowupTypes,
  fixturesOwnedFollowupTypes,
} from './followupTypes'

export const fixturesProposedFollowupTypes = [
  // We propose half of the fixtures default followup types
  ...fixturesDefaultFollowupTypes
    .filter((_, index) => index % 2 === 0)
    .map(({ id }) => ({
      structureId: fixtureStructure.id,
      followupTypeId: id,
    })),

  // We propose all followupTypes that are owned by the structure
  ...fixturesOwnedFollowupTypes.map(
    ({
      ownedByStructureId,
      id,
    }: {
      ownedByStructureId: string
      id: string
    }) => ({
      structureId: ownedByStructureId,
      followupTypeId: id,
    }),
  ),
] satisfies Exclude<
  Parameters<typeof prismaClient.proposedFollowupType.createMany>[0],
  undefined
>['data']
