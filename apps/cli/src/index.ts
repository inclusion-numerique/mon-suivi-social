import { Command } from '@commander-js/extra-typings'
import { createDotEnvFromSecrets } from '@mss/cli/commands/secrets/createDotEnvFromSecrets'
import { createGithubDeployment } from '@mss/cli/commands/github/createGithubDeployment'
import { updateGithubDeployment } from '@mss/cli/commands/github/updateGithubDeployment'
import { deactivateGithubDeployment } from '@mss/cli/commands/github/deactivateGithubDeployment'
import { loadFixtures } from '@mss/cli/commands/database/loadFixtures'
import { createDotEnvFromCdk } from '@mss/cli/commands/infrastructure/createDotEnvFromCdk'
import { listSecrets } from '@mss/cli/commands/secrets/listSecrets'
import { getSecretValue } from '@mss/cli/commands/secrets/getSecretValue'
import { setupDatabaseSecret } from '@mss/cli/commands/secrets/setupDatabaseSecret'

const program = new Command()

program.addCommand(listSecrets)
program.addCommand(getSecretValue)
program.addCommand(setupDatabaseSecret)
program.addCommand(createDotEnvFromCdk)
program.addCommand(createDotEnvFromSecrets)
program.addCommand(createGithubDeployment)
program.addCommand(updateGithubDeployment)
program.addCommand(deactivateGithubDeployment)
program.addCommand(loadFixtures)

program.parse()
