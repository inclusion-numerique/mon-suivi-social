import 'tsconfig-paths/register'
import { prismaClient } from '@mss/web/src/prismaClient'
import { PrivateConfig } from '@mss/web/src/config'
import { fixtureStructure } from '../fixtures/structures'
import { fixturesFollowupTypes } from '../fixtures/followupTypes'
import { previewUserFixtures, userFixtures } from '../fixtures/users'
import { fixtureBeneficiaries } from '../fixtures/beneficiaries'
import { fixtureFollowups } from '../fixtures/followups'
import { fixturesHelpRequests } from '../fixtures/helpRequests'
import { fixturesProposedFollowupTypes } from '../fixtures/proposedFollowupTypes'

// Loaded on all environments
export const loadCommonFixtures = async () => {
  await prismaClient.$transaction([
    prismaClient.structure.createMany({
      data: fixtureStructure,
      skipDuplicates: true,
    }),
    prismaClient.followupType.createMany({
      data: fixturesFollowupTypes,
      skipDuplicates: true,
    }),
    prismaClient.proposedFollowupType.createMany({
      data: fixturesProposedFollowupTypes,
      skipDuplicates: true,
    }),
    prismaClient.user.createMany({
      data: userFixtures,
      skipDuplicates: true,
    }),
    ...fixtureBeneficiaries.map(({ id, ...data }) =>
      prismaClient.beneficiary.upsert({
        create: { id, ...data },
        where: { id },
        update: {},
      }),
    ),
    ...fixtureFollowups.map(({ id, ...data }) =>
      prismaClient.followup.upsert({
        create: { id, ...data },
        where: { id },
        update: {},
      }),
    ),
    prismaClient.helpRequest.createMany({
      data: fixturesHelpRequests,
      skipDuplicates: true,
    }),
  ])
}

// Only loaded in preview environment, not main
export const loadPreviewFixtures = async () => {
  await prismaClient.$transaction([
    prismaClient.user.createMany({
      data: previewUserFixtures,
      skipDuplicates: true,
    }),
  ])
}

const main = async () => {
  await loadCommonFixtures()
  if (!PrivateConfig.isMain) {
    await loadPreviewFixtures()
  }
}

main().then(() => process.exit(0))
