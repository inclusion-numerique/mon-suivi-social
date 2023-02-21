import { createPreviewSubdomain } from './utils'

describe('utils', () => {
  describe('createPreviewSubdomain', () => {
    it('Shortens long DNS domain name', () => {
      const result = createPreviewSubdomain(
        'a-quite-long-branch-name',
        'a-very-long.subdomain.with-a-lot-of-things.dev',
      )
      expect(result.length).toEqual(63)
      expect(result).toEqual(
        'a-quite-long-bra.a-very-long.subdomain.with-a-lot-of-things.dev',
      )
    })

    it('No-ops short domain names', () => {
      const result = createPreviewSubdomain(
        'feat-short',
        'a-very-long.subdomain.with-a-lot-of-things.dev',
      )
      console.log('result', result)
      expect(result.length).toBeLessThan(63)
      expect(result).toEqual(
        'feat-short.a-very-long.subdomain.with-a-lot-of-things.dev',
      )
    })
  })
})
