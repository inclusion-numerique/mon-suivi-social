import { createPreviewSubdomain } from './utils'

describe('utils', () => {
  describe('createPreviewSubdomain', () => {
    it('Shortens long DNS domain name', () => {
      const result = createPreviewSubdomain(
        'a-quite-long-branch-name',
        'a-very-long.subdomain.with-a-lot-of-things.dev',
      )
      expect(result.hostname).toEqual(
        'a-quite-long.a-very-long.subdomain.with-a-lot-of-things.dev',
      )
      expect(result.subdomain).toEqual('a-quite-long')
    })

    it('Removes trailing hyphen of long DNS domain name', () => {
      const result = createPreviewSubdomain(
        'unfortunate-how-it-is',
        'a-very-long.subdomain.with-a-lot-of-things.dev',
      )
      expect(result.hostname).toEqual(
        'unfortunate-how.a-very-long.subdomain.with-a-lot-of-things.dev',
      )
      expect(result.subdomain).toEqual('unfortunate-how')
    })

    it('No-ops short domain names', () => {
      const result = createPreviewSubdomain(
        'feat-short',
        'a-very-long.subdomain.with-a-lot-of-things.dev',
      )
      expect(result.hostname).toEqual(
        'feat-short.a-very-long.subdomain.with-a-lot-of-things.dev',
      )
      expect(result.subdomain).toEqual('feat-short')
    })
  })
})
