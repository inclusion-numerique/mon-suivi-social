import { shortenNamespace } from '@mss/cdk/utils'

export const databasePasswordSecretName = (namespace: string) =>
  `DATABASE_PASSWORD_${shortenNamespace(namespace, 10)}`
