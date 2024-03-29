import { prismaClient } from '@mss/web/src/server/prisma'
import { fixtureStructure } from './structures'
import { fixtureBeneficiaries } from './beneficiaries'
import { fixturesProposedFollowupTypes } from './proposedFollowupTypes'

export const fixturesHelpRequests = [
  {
    id: 'c95126c4-b0b5-4606-82ca-8d95c544fd35',
    status: 'Accepted',
    typeId: fixturesProposedFollowupTypes[4].followupTypeId,
    structureId: fixtureStructure.id,
    beneficiaryId: fixtureBeneficiaries[0].id,
    externalStructure: false,
    financialSupport: false,
    openingDate: new Date('2022-10-26'),
  },
  {
    id: '4aad5e90-7a9e-4aeb-90f1-1c986664f47f',
    status: 'InvestigationOngoing',
    typeId: fixturesProposedFollowupTypes[3].followupTypeId,
    structureId: fixtureStructure.id,
    beneficiaryId: fixtureBeneficiaries[2].id,
    externalStructure: false,
    financialSupport: false,
    openingDate: new Date('2022-10-27'),
  },
] satisfies Exclude<
  Parameters<typeof prismaClient.helpRequest.createMany>[0],
  undefined
>['data']
