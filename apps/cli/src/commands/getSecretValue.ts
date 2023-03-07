import { Argument, Command } from '@commander-js/extra-typings'
import { output } from '@mss/cli/output'
import { listSecrets } from '@mss/config/secrets/listSecrets'
import { findSecretIdByName } from '@mss/config/secrets/findSecretByName'
import { getSecretValue } from '@mss/config/secrets/getSecretValue'

/**
 * This command outputs available secrets names
 */
// eslint-disable-next-line unicorn/prevent-abbreviations
export const getSecretValue = new Command()
  .command('secrets:get')
  .addArgument(new Argument('<name>', 'Name of the secret'))
  .action(async (name) => {
    const { secrets } = await listSecrets()
    const { id } = findSecretIdByName(secrets, name)
    const value = await getSecretValue({ id })

    output(value)
  })
