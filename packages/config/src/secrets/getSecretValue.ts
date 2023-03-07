import { secretClient } from '@mss/config/secrets/secretClient'

/**
 * Returns decoded secret value
 */
export const getSecretValue = ({
  id,
  revision = 'latest',
}: {
  id: string
  revision?: string
}) =>
  secretClient
    .get<{ secret_id: string; revision: string; data: string }>(
      `/${id}/versions/${revision}/access`,
    )
    .then(({ data }) => Buffer.from(data.data, 'base64').toString('utf8'))
