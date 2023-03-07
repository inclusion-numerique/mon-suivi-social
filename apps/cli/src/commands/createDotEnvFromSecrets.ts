// eslint-disable-next-line unicorn/prevent-abbreviations
import { Argument, Command } from '@commander-js/extra-typings'
import { listSecrets } from '@mss/config/secrets/listSecrets'

const tags = ['web', 'project', 'ci']

/**
 * This command fetches secrets from Secret Vault using scaleway keys and put them into .env
 */
// eslint-disable-next-line unicorn/prevent-abbreviations
export const createDotEnvFromSecrets = new Command()
  .command('dotenv:from-secrets')
  .addArgument(new Argument('<tags>', 'secret tags').choices(tags))
  .option(
    '-p --prefix [prefix]',
    'will be added to env var name eg: "TF_VAR_" for "TF_VAR_INITIAL_NAME"',
  )
  .action(async (tags, { prefix }) => {
    const list = await listSecrets()

    throw new Error('WIP')
  })
