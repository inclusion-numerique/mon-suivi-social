import 'tsconfig-paths/register'
import { prismaClient } from '@mss/web/src/prismaClient'
import { PrivateConfig, PublicConfig } from '@mss/web/src/config'

// Loaded on all environments
export const loadCommonFixtures = async () => {
  // TODO MSS See what fixtures are needed from latest @thibaud MR
}

const organisations: Exclude<
  Parameters<typeof prismaClient.organisation.createMany>[0],
  undefined
>['data'] = [
  {
    id: '3cb0f254-1e5a-4b60-82e8-dd58cf7bf710',
    name: 'Structure de Démonstration',
    email: 'hugues.maignol@beta.gouv.fr',
    type: 'Ccas',
    address: '12 rue de la République',
    city: 'Lyon',
    zipcode: '69002',
    phone: '06 06 06 06 06',
  },
]

const followupTypes: Exclude<
  Parameters<typeof prismaClient.followupType.createMany>[0],
  undefined
>['data'] = [
  {
    id: 'a5ddd670-448c-4242-b919-962bcaf047aa',
    name: 'Inclusion numérique',
    type: 'Legal',
    default: true,
  },
  {
    id: '047c1831-14e4-4598-945f-5763999f6898',
    name: 'Aide au transport',
    type: 'Optional',
    default: true,
  },
]

const agents: Exclude<
  Parameters<typeof prismaClient.user.createMany>[0],
  undefined
>['data'] = [
  {
    id: 'eecac657-f415-47e1-8087-c4508ea16191',
    name: 'Agent Démo',
    email: 'hugues+mss-test@kime.tech',
    organisationId: organisations[0].id,
    status: 'Active',
    role: 'ReceptionAgent',
  },
]

const beneficiaries: Exclude<
  Parameters<typeof prismaClient.beneficiary.createMany>[0],
  undefined
>['data'] = [
  {
    id: 'db5190cf-3942-4eea-90f3-8a2992146360',
    firstName: 'Alice',
    birthName: 'Allard',
    email: 'hugues.maignol@beta.gouv.fr',
    fileNumber: 'AA0000DEMO',
    status: 'Active',
    organisationId: organisations[0].id,
    agentId: agents[0].id!,
  },
  {
    id: '19131e3c-ece5-4aba-a322-f795c1342287',
    firstName: 'Benoit',
    birthName: 'Blanchet',
    email: 'hugues.maignol@beta.gouv.fr',
    fileNumber: 'BB0000DEMO',
    status: 'Active',
    organisationId: organisations[0].id,
    agentId: agents[0].id!,
  },
  {
    id: '4d7b7c30-0630-4a3e-b52a-c4b176ad7e85',
    firstName: 'Carole',
    birthName: 'Cartier',
    email: 'hugues.maignol@beta.gouv.fr',
    fileNumber: 'CC0000DEMO',
    status: 'Active',
    organisationId: organisations[0].id,
    agentId: agents[0].id!,
  },
  {
    id: '0042d145-d573-423c-be40-29a3090b44ff',
    firstName: 'Denis',
    birthName: 'Dubois',
    email: 'hugues.maignol@beta.gouv.fr',
    fileNumber: 'DD0000DEMO',
    status: 'Active',
    organisationId: organisations[0].id,
    agentId: agents[0].id!,
  },
]

const followups: Exclude<
  Parameters<typeof prismaClient.followup.createMany>[0],
  undefined
>['data'] = [
  {
    id: 'e20b26f8-52fd-4620-8959-4cbb4623fb05',
    status: 'Done',
    agentId: agents[0].id!,
    organisationId: organisations[0].id,
    beneficiaryId: beneficiaries[0].id,
    medium: 'PlannedInPerson',
    typeId: followupTypes[0].id,
    date: new Date('2022-10-20'),
  },
  {
    id: '8f8a083f-f04f-4977-9e07-8b88135c7210',
    status: 'Done',
    agentId: agents[0].id!,
    organisationId: organisations[0].id,
    beneficiaryId: beneficiaries[0].id,
    medium: 'PhoneCall',
    typeId: followupTypes[0].id,
    date: new Date('2022-10-21'),
  },
  {
    id: '07e809c3-4b6e-4152-bde3-357c501c981f',
    status: 'Done',
    agentId: agents[0].id!,
    organisationId: organisations[0].id,
    beneficiaryId: beneficiaries[2].id,
    medium: 'Videoconference',
    typeId: followupTypes[0].id,
    date: new Date('2022-10-22'),
  },
  {
    id: 'b811a9d7-ada7-42ca-b809-926caaebaf52',
    status: 'Done',
    agentId: agents[0].id!,
    organisationId: organisations[0].id,
    beneficiaryId: beneficiaries[1].id,
    medium: 'UnplannedInPerson',
    typeId: followupTypes[0].id,
    date: new Date('2022-10-23'),
  },
  {
    id: 'b15eba7c-d00d-4de6-a227-75361066c322',
    status: 'InProgress',
    agentId: agents[0].id!,
    organisationId: organisations[0].id,
    beneficiaryId: beneficiaries[2].id,
    medium: 'PlannedInPerson',
    typeId: followupTypes[0].id,
    date: new Date('2022-10-24'),
  },
  {
    id: '19ed2ebb-4e28-433a-9e2d-d97d9098624a',
    status: 'InProgress',
    agentId: agents[0].id!,
    organisationId: organisations[0].id,
    beneficiaryId: beneficiaries[3].id,
    medium: 'PhoneCall',
    typeId: followupTypes[0].id,
    date: new Date('2022-10-25'),
  },
]

const helpRequests: Exclude<
  Parameters<typeof prismaClient.helpRequest.createMany>[0],
  undefined
>['data'] = [
  {
    id: 'c95126c4-b0b5-4606-82ca-8d95c544fd35',
    status: 'Accepted',
    typeId: followupTypes[0].id,
    agentId: agents[0].id!,
    organisationId: organisations[0].id,
    beneficiaryId: beneficiaries[0].id,
    externalOrganisation: false,
    financialSupport: false,
    openingDate: new Date('2022-10-26'),
  },
  {
    id: '4aad5e90-7a9e-4aeb-90f1-1c986664f47f',
    status: 'WaitingForDecision',
    typeId: followupTypes[1].id,
    agentId: agents[0].id!,
    organisationId: organisations[0].id,
    beneficiaryId: beneficiaries[2].id,
    externalOrganisation: false,
    financialSupport: false,
    openingDate: new Date('2022-10-27'),
  },
]

// Only loaded in preview environment, not main
export const loadPreviewFixtures = async () => {
  await prismaClient.$transaction([
    prismaClient.organisation.createMany({
      data: organisations,
      skipDuplicates: true,
    }),
    prismaClient.followupType.createMany({
      data: followupTypes,
      skipDuplicates: true,
    }),
    prismaClient.user.createMany({
      data: agents,
      skipDuplicates: true,
    }),
    prismaClient.beneficiary.createMany({
      data: beneficiaries,
      skipDuplicates: true,
    }),
    prismaClient.followup.createMany({
      data: followups,
      skipDuplicates: true,
    }),
    prismaClient.helpRequest.createMany({
      data: helpRequests,
      skipDuplicates: true,
    }),
    // Add followup types to all fixtures organizations
    // Could be more efficient but ok for this low volume of fixtures
    ...followupTypes
      .map((type) =>
        organisations.map((organisation) =>
          prismaClient.organisation.update({
            where: { id: organisation.id },
            data: { followupTypes: { connect: { id: type.id } } },
          }),
        ),
      )
      .flat(),
  ])
}

const main = async () => {
  await loadCommonFixtures()
  if (!PrivateConfig.isMain) {
    await loadPreviewFixtures()
  }
}

main().then(() => process.exit(0))
