import { Argument, Command } from '@commander-js/extra-typings'
import { output } from '@mss/cli/output'
import { listSecrets } from '@mss/config/secrets/listSecrets'
import { databasePasswordSecretName } from '@mss/config/secrets/databasePasswordSecretName'
import { createSecret } from '@mss/config/secrets/createSecret'
import { generateDatabasePassword } from '@mss/config/secrets/generateDatabasePassword'

/**
 * This command outputs available secrets names
 */
export const setupDatabaseSecret = new Command()
  .command('secrets:database:setup')
  .description(
    'This will create a new Database password if it does not already exists',
  )
  .addArgument(new Argument('<namespace>', 'Name of the preview deployment'))
  .action(async (namespace) => {
    const secretName = databasePasswordSecretName(namespace)
    const { secrets } = await listSecrets()

    const existing = secrets.find((secret) => secret.name === secretName)

    if (existing) {
      output(`Secret ${secretName} already exists. Aborting setup.`)
      return
    }

    await createSecret({
      name: secretName,
      value: generateDatabasePassword(),
      tags: ['database', namespace],
      description: `Database password for "${namespace}" instance`,
    })

    output(`Secret ${secretName} has been created successfully`)
  })
