import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { updateGithubDeployment } from './commands/updateGithubDeployment'
import { Command } from '@commander-js/extra-typings'
import { createGithubDeployment } from './commands/createGithubDeployment'

dotenv.config({ path: resolve(__dirname, '../../../.env') })

const program = new Command()

program.addCommand(createGithubDeployment)
program.addCommand(updateGithubDeployment)

program.parse()
