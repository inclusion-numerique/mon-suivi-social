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
import { createTfVarsFileFromEnvironment } from '@mss/cli/commands/infrastructure/createTfVarsFileFromEnvironment'
import { checkDeploymentStatus } from '@mss/cli/commands/deployment/checkDeploymentStatus'
import { addNextPublicVariablesToDotEnv } from '@mss/cli/commands/infrastructure/addNextPublicVariablesToDotEnv'
import { getDatabasePasswordSecret } from '@mss/cli/commands/secrets/getDatabasePasswordSecret'

const program = new Command()

program.addCommand(listSecrets)
program.addCommand(getSecretValue)
program.addCommand(getDatabasePasswordSecret)
program.addCommand(setupDatabaseSecret)
program.addCommand(createDotEnvFromCdk)
program.addCommand(createDotEnvFromSecrets)
program.addCommand(createGithubDeployment)
program.addCommand(updateGithubDeployment)
program.addCommand(deactivateGithubDeployment)
program.addCommand(loadFixtures)
program.addCommand(createTfVarsFileFromEnvironment)
program.addCommand(checkDeploymentStatus)
program.addCommand(addNextPublicVariablesToDotEnv)

program.parse()
