import { projectId, secretClient } from '@mss/config/secrets/secretClient'

export const createSecret = async ({
  name,
  value,
  tags,
  description,
}: {
  name: string
  value: string
  tags?: string[]
  description?: string
}) => {
  const secret = await secretClient
    .post<{
      id: string
      project_id: string
      name: string
      status: 'ready' | 'locked'
      created_at: string
      updated_at: string
      tags: string[]
      version_count: number
      description: string
      region: string
    }>('/', {
      name,
      tags,
      description,
      project_id: projectId,
    })
    .then(({ data }) => data)

  const version = await secretClient.post<{
    secret_id: string
    revision: string
    status: string
    created_at: string
    updated_at: string
    description: string
  }>(`/${secret.id}/versions`, {
    data: Buffer.from(value, 'utf8').toString('base64'),
    description,
  })

  return { secret, version }
}
