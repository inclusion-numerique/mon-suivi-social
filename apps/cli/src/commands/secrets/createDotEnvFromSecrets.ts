// eslint-disable-next-line unicorn/prevent-abbreviations
import { Argument, Command } from '@commander-js/extra-typings'
import { listSecrets } from '@mss/config/secrets/listSecrets'
import { output } from '@mss/cli/output'
import { getSecretValue } from '@mss/config/secrets/getSecretValue'
import { appendEnvVariablesToDotEnvFile } from '@mss/cli/dotEnvFile'

/**
 * This command fetches secrets from Secret Vault using scaleway keys and put them into .env
 */
// eslint-disable-next-line unicorn/prevent-abbreviations
export const createDotEnvFromSecrets = new Command()
  .command('dotenv:from-secrets')
  .addArgument(new Argument('<tags>', 'Tags (project, web, ci, dev'))
  .action(async (tags) => {
    const list = await listSecrets({ tags: tags.split(',') })

    const environmentVariables = await Promise.all(
      list.secrets.map(async ({ name, id }) => {
        const value = await getSecretValue({ id })
        return { name, value }
      }),
    )

    await appendEnvVariablesToDotEnvFile({
      comment: `Secrets variables with tag${
        tags.length === 1 ? '' : 's'
      } "${tags}"`,
      environmentVariables,
    })

    output(`${environmentVariables.length} secrets added to .env file`)
  })
