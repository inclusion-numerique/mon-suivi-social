import 'tsconfig-paths/register'
import { prismaClient } from '@mss/web/src/server/prisma'
import { fixtureStructure } from '@mss/cli/fixtures/structures'
import { fixturesFollowupTypes } from '@mss/cli/fixtures/followupTypes'
import { previewUserFixtures, userFixtures } from '@mss/cli/fixtures/users'
import { fixtureBeneficiaries } from '@mss/cli/fixtures/beneficiaries'
import { fixtureFollowups } from '@mss/cli/fixtures/followups'
import { fixturesHelpRequests } from '@mss/cli/fixtures/helpRequests'
import { fixturesProposedFollowupTypes } from '@mss/cli/fixtures/proposedFollowupTypes'
import { output } from '@mss/cli/output'
import { Command } from '@commander-js/extra-typings'
import { ServerWebAppConfig } from '@mss/web/webAppConfig'

// Loaded on all environments
export const commonFixtures = () => [
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
]

// Only loaded in preview environment, not main
export const previewFixtures = () => [
  prismaClient.user.createMany({
    data: previewUserFixtures,
    skipDuplicates: true,
  }),
]

export const loadFixtures = new Command()
  .command('fixtures:load')
  .action(async () => {
    if (ServerWebAppConfig.isMain) {
      output(`⏱️  Loading common fixtures...`)
      await prismaClient.$transaction(commonFixtures())
      output('👍 Done !')
      return
    }

    output(`⏱️  Loading common and preview fixtures`)
    await prismaClient.$transaction([...commonFixtures(), ...previewFixtures()])
    output('👍 Done !')
  })
