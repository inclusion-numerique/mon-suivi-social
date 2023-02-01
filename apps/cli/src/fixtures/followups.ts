import { prismaClient } from '@mss/web/src/prismaClient'
import { fixtureStructure } from './structures'
import { fixtureBeneficiaries } from './beneficiaries'
import { fixturesProposedFollowupTypes } from './proposedFollowupTypes'

export const fixtureFollowups = [
  {
    id: 'e20b26f8-52fd-4620-8959-4cbb4623fb05',
    status: 'Done',
    structureId: fixtureStructure.id,
    beneficiaryId: fixtureBeneficiaries[0].id,
    medium: 'PlannedInPerson',
    typeId: fixturesProposedFollowupTypes[0].followupTypeId,
    date: new Date('2022-10-20'),
  },
  {
    id: '8f8a083f-f04f-4977-9e07-8b88135c7210',
    status: 'Done',
    structureId: fixtureStructure.id,
    beneficiaryId: fixtureBeneficiaries[0].id,
    medium: 'PhoneCall',
    typeId: fixturesProposedFollowupTypes[1].followupTypeId,
    date: new Date('2022-10-21'),
  },
  {
    id: '07e809c3-4b6e-4152-bde3-357c501c981f',
    status: 'Done',
    structureId: fixtureStructure.id,
    beneficiaryId: fixtureBeneficiaries[2].id,
    medium: 'Videoconference',
    typeId: fixturesProposedFollowupTypes[2].followupTypeId,
    date: new Date('2022-10-22'),
  },
  {
    id: 'b811a9d7-ada7-42ca-b809-926caaebaf52',
    status: 'Done',
    structureId: fixtureStructure.id,
    beneficiaryId: fixtureBeneficiaries[1].id,
    medium: 'UnplannedInPerson',
    typeId: fixturesProposedFollowupTypes[2].followupTypeId,
    date: new Date('2022-10-23'),
  },
  {
    id: 'b15eba7c-d00d-4de6-a227-75361066c322',
    status: 'InProgress',
    structureId: fixtureStructure.id,
    beneficiaryId: fixtureBeneficiaries[2].id,
    medium: 'PlannedInPerson',
    typeId: fixturesProposedFollowupTypes[4].followupTypeId,
    date: new Date('2022-10-24'),
  },
  {
    id: '19ed2ebb-4e28-433a-9e2d-d97d9098624a',
    status: 'InProgress',
    structureId: fixtureStructure.id,
    beneficiaryId: fixtureBeneficiaries[3].id,
    medium: 'PhoneCall',
    typeId: fixturesProposedFollowupTypes[4].followupTypeId,
    date: new Date('2022-10-25'),
  },
] satisfies Exclude<
  Parameters<typeof prismaClient.followup.createMany>[0],
  undefined
>['data']
