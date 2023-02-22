import { createPreviewSubdomain } from './utils'

describe('utils', () => {
  describe('createPreviewSubdomain', () => {
    it('Shortens long DNS domain name', () => {
      const result = createPreviewSubdomain(
        'a-quite-long-branch-name',
        'a-very-long.subdomain.with-a-lot-of-things.dev',
      )
      expect(result.hostName).toEqual(
        'a-quite-long.a-very-long.subdomain.with-a-lot-of-things.dev',
      )
      expect(result.subdomain).toEqual('a-quite-long')
    })

    it('No-ops short domain names', () => {
      const result = createPreviewSubdomain(
        'feat-short',
        'a-very-long.subdomain.with-a-lot-of-things.dev',
      )
      expect(result.hostName).toEqual(
        'feat-short.a-very-long.subdomain.with-a-lot-of-things.dev',
      )
      expect(result.subdomain).toEqual('feat-short')
    })
  })
})
