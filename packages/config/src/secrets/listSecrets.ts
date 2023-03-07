import { secretClient } from '@mss/config/secrets/secretClient'

export const listSecrets = (_options: { tags?: string[] } = {}) =>
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
        // FIXME invalid params tags[]=one&tags[]=two, what is Scaleway specs on query params for arrays ?
        // tags,
      },
    })
    .then(({ data }) => data)
