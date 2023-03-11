// eslint-disable-next-line unicorn/prevent-abbreviations
import 'tsconfig-paths/register'
import { Argument, Command } from '@commander-js/extra-typings'
import { resolve } from 'node:path'
import { writeFile } from 'node:fs/promises'
import { output } from '@mss/cli/output'

// See https://developer.hashicorp.com/terraform/language/values/variables#variable-definitions-tfvars-files
// eslint-disable-next-line unicorn/prevent-abbreviations
export const createTfVarsFileFromEnvironment = new Command()
  .command('terraform:vars-from-env')
  .addArgument(new Argument('<stack>', 'CDK Stack').choices(['web', 'project']))
  .action(async (stack) => {
    // TODO Factorize this list with cdk vars list
    const variableNames =
      stack === 'web'
        ? [
            'WEB_CONTAINER_IMAGE',
            'INCLUSION_CONNECT_PREVIEW_ISSUER',
            'INCLUSION_CONNECT_MAIN_ISSUER',
            'INCLUSION_CONNECT_PREVIEW_CLIENT_ID',
            'INCLUSION_CONNECT_MAIN_CLIENT_ID',
            'SCW_DEFAULT_ORGANIZATION_ID',
            'SCW_PROJECT_ID',
            'SCW_ACCESS_KEY',
            'SCW_SECRET_KEY',
            'DATABASE_PASSWORD',
            'INCLUSION_CONNECT_PREVIEW_CLIENT_SECRET',
            'INCLUSION_CONNECT_MAIN_CLIENT_SECRET',
          ]
        : stack === 'project'
        ? [
            'SCW_DEFAULT_ORGANIZATION_ID',
            'SCW_PROJECT_ID',
            'NEXTAUTH_SECRET',
            'SCW_ACCESS_KEY',
            'SCW_SECRET_KEY',
            'SENTRY_AUTH_TOKEN',
            'SMTP_PASSWORD',
            'SMTP_SERVER',
            'SMTP_USERNAME',
          ]
        : null

    if (!variableNames) {
      throw new Error('Invalid stack argument')
    }

    const variables = Object.fromEntries(
      variableNames.map((name) => {
        const value = process.env[name]
        if (!value) {
          throw new Error(
            `Variable ${name} is not present in environment but needed as a terraform variable for "${stack}" stack`,
          )
        }

        return [name, value]
      }),
    )

    const tfVariablesFile = resolve(
      // eslint-disable-next-line unicorn/prefer-module
      __dirname,
      '../../../../../.tfvars.json',
    )
    await writeFile(tfVariablesFile, JSON.stringify(variables, null, 2))

    output(
      `The ${variableNames.length} terraform variables for stack ${stack} have been added to ${tfVariablesFile}`,
    )
  })
