import * as dotenv from 'dotenv'
import { resolve } from 'node:path'
import { Command } from '@commander-js/extra-typings'
import { updateGithubDeployment } from './commands/updateGithubDeployment'
import { createGithubDeployment } from './commands/createGithubDeployment'
import { deactivateGithubDeployment } from './commands/deactivateGithubDeployment'

dotenv.config({
  // eslint-disable-next-line unicorn/prefer-module
  path: resolve(__dirname, '../../../.env'),
})

const program = new Command()

program.addCommand(createGithubDeployment)
program.addCommand(updateGithubDeployment)
program.addCommand(deactivateGithubDeployment)

program.parse()
