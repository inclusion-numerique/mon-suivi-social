// eslint-disable-next-line unicorn/prevent-abbreviations
import { Argument, Command } from '@commander-js/extra-typings'
import { scalewayAxios } from '@mss/cli/scaleway'
import { region } from '@mss/cdk/project'

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
  // TODO remove this eslint disable when https://github.com/commander-js/extra-typings/pull/35 is merged
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .action(async (tags, { prefix }) => {
    // https://developers.scaleway.com/en/products/secret_manager/api/v1alpha1/#get-ccc31e

    // TODO For auth, use application key in passbolt from Oscar
    const list = await scalewayAxios(
      `/secret-manager/v1alpha1/regions/${region}/secrets`,
    )

    console.log('LIST', list)

    throw new Error('WIP')
  })
