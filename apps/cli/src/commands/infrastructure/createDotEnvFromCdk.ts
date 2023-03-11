// eslint-disable-next-line unicorn/prevent-abbreviations
import 'tsconfig-paths/register'

import { getCdkOutput } from '@mss/cdk/getCdkOutput'
import { Argument, Command } from '@commander-js/extra-typings'
import { appendEnvVariablesToDotEnvFile } from '@mss/cli/dotEnvFile'

const stacks = ['web', 'project']

// eslint-disable-next-line unicorn/prevent-abbreviations
export const createDotEnvFromCdk = new Command()
  .command('dotenv:from-cdk')
  .addArgument(new Argument('<stack>', 'cdk stack').choices(stacks))
  .action(async (stack) => {
    if (stack === 'web') {
      const { databaseUrl, webBaseUrl } = await getCdkOutput('web')

      await appendEnvVariablesToDotEnvFile({
        comment: 'From web stack cdk output',
        environmentVariables: [
          {
            name: 'DATABASE_URL',
            value: databaseUrl,
          },
          {
            name: 'WEB_BASE_URL',
            value: webBaseUrl,
          },
        ],
      })
    }
    if (stack === 'project') {
      const { databaseInstanceId } = await getCdkOutput('project')

      await appendEnvVariablesToDotEnvFile({
        comment: 'From project stack cdk output',
        environmentVariables: [
          {
            name: 'DATABASE_INSTANCE_ID',
            value: databaseInstanceId,
          },
        ],
      })
    }

    throw new Error('Invalid stack provided')
  })
