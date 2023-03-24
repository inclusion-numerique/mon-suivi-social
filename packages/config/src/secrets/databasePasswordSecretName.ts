import { shortenNamespace } from '@sde/cdk/utils'

export const databasePasswordSecretName = (namespace: string) =>
  `DATABASE_PASSWORD_${shortenNamespace(
    namespace
      // Secrets name should not include digits
      .replace(/\d/g, '')
      // When digits are removed, there might be multiple dashes in a row
      .replace(/--+/g, '-')
      // Remove prefix hyphen
      .replace(/^-/, ''),
    // Shorten namespace will remove trailing hyphen
    32,
  )}`
