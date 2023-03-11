import { secretClient } from '@mss/config/secrets/secretClient'

export const listSecrets = ({ tags }: { tags?: string[] } = {}) =>
  secretClient
    .get<{
      secrets: {
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
      }[]
    }>('/', {
      params: {
        // FIX ME does not work for multiple tags and not documented by Scaleway API
        tags: tags?.join(', '),
        page_size: 100,
      },
    })
    .then(({ data }) => data)
