import 'tsconfig-paths/register'
import { prismaClient } from '@mss/web/src/prismaClient'
import { PrivateConfig } from '@mss/web/src/config'
import { fixtureStructure } from '../fixtures/structures'
import { fixturesFollowupTypes } from '../fixtures/followupTypes'
import { previewUserFixtures, userFixtures } from '../fixtures/users'
import { fixtureBeneficiaries } from '../fixtures/beneficiaries'
import { fixtureFollowups } from '../fixtures/followups'
import { fixturesHelpRequests } from '../fixtures/helpRequests'

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
    prismaClient.user.createMany({
      data: userFixtures,
      skipDuplicates: true,
    }),
    prismaClient.beneficiary.createMany({
      data: fixtureBeneficiaries,
      skipDuplicates: true,
    }),
    prismaClient.followup.createMany({
      data: fixtureFollowups,
      skipDuplicates: true,
    }),
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
