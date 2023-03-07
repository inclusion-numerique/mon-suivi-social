import { Command } from '@commander-js/extra-typings'
import { createDotEnvFromCdk } from '@mss/cli/commands/createDotEnvFromCdk'
import { updateGithubDeployment } from '@mss/cli/commands/updateGithubDeployment'
import { createGithubDeployment } from '@mss/cli/commands/createGithubDeployment'
import { deactivateGithubDeployment } from '@mss/cli/commands/deactivateGithubDeployment'
import { createDotEnvFromSecrets } from '@mss/cli/commands/createDotEnvFromSecrets'
import { listSecrets } from '@mss/cli/commands/listSecrets'
import { getSecretValue } from '@mss/cli/commands/getSecretValue'
import { loadFixtures } from '@mss/cli/commands/loadFixtures'

const program = new Command()

program.addCommand(listSecrets)
program.addCommand(getSecretValue)
program.addCommand(createDotEnvFromCdk)
program.addCommand(createDotEnvFromSecrets)
program.addCommand(createGithubDeployment)
program.addCommand(updateGithubDeployment)
program.addCommand(deactivateGithubDeployment)
program.addCommand(loadFixtures)

program.parse()
