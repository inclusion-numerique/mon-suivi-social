// eslint-disable-next-line unicorn/prevent-abbreviations
import 'tsconfig-paths/register'
import { Argument, Command } from '@commander-js/extra-typings'
import { appendEnvVariablesToDotEnvFile } from '@mss/cli/dotEnvFile'

// eslint-disable-next-line unicorn/prevent-abbreviations
export const addNextPublicVariablesToDotEnv = new Command()
  .command('dotenv:add-next-public')
  .addArgument(new Argument('<namespace>', 'deployment namespace'))
  .action(async (namespace) => {
    const isMain = namespace === 'main'

    await appendEnvVariablesToDotEnvFile({
      comment: 'Next public environment needed at build time',
      environmentVariables: [
        {
          name: 'NEXT_PUBLIC_INCLUSION_CONNECT_ISSUER',
          value: isMain
            ? process.env.INCLUSION_CONNECT_MAIN_ISSUER ?? ''
            : process.env.INCLUSION_CONNECT_PREVIEW_ISSUER ?? '',
        },
        {
          name: 'NEXT_PUBLIC_INCLUSION_CONNECT_CLIENT_ID',
          value: isMain
            ? process.env.INCLUSION_CONNECT_MAIN_CLIENT_ID ?? ''
            : process.env.INCLUSION_CONNECT_PREVIEW_CLIENT_ID ?? '',
        },
        { name: 'NEXT_PUBLIC_SENTRY_ENVIRONMENT', value: namespace },
      ],
    })
  })
