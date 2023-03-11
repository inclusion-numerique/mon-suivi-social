// eslint-disable-next-line unicorn/prevent-abbreviations
import { Argument, Command } from '@commander-js/extra-typings'
import { listSecrets } from '@mss/config/secrets/listSecrets'
import { output } from '@mss/cli/output'

const tags = ['web', 'project', 'ci']

/**
 * This command fetches secrets from Secret Vault using scaleway keys and put them into .env
 */
// eslint-disable-next-line unicorn/prevent-abbreviations
export const createDotEnvFromSecrets = new Command()
  .command('dotenv:from-secrets')
  .addArgument(new Argument('<tags>', 'secret tags').choices(tags))
  .action(async (_tags) => {
    const list = await listSecrets()

    output(list)

    throw new Error('WIP')
  })
