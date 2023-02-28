import * as dotenv from 'dotenv'
import { dirname, resolve } from 'node:path'
import { Command } from '@commander-js/extra-typings'
import { fileURLToPath } from 'node:url'
import { updateGithubDeployment } from './commands/updateGithubDeployment'
import { createGithubDeployment } from './commands/createGithubDeployment'
import { deactivateGithubDeployment } from './commands/deactivateGithubDeployment'

dotenv.config({
  path: resolve(dirname(fileURLToPath(import.meta.url)), '../../../.env'),
})

const program = new Command()

program.addCommand(createGithubDeployment)
program.addCommand(updateGithubDeployment)
program.addCommand(deactivateGithubDeployment)

program.parse()
