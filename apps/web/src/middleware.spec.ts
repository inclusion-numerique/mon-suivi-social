import { NextRequest } from 'next/server'
import middleware from './middleware'

describe('middleware', () => {
  const originalEnv = process.env

  afterEach(() => {
    process.env = originalEnv
  })

  it('Adds CSP headers in development environment', () => {
    const result = middleware(new NextRequest('http://example.com/'))
    // FIXME: replace with Content-Security-Policy
    expect(result.headers.get('Content-Security-Policy-Report-Only')).toBeNull()
  })

  it('Adds CSP headers in production environment', () => {
    process.env = { NODE_ENV: 'production' }
    const result = middleware(new NextRequest('http://example.com/'))
    // FIXME: replace with Content-Security-Policy
    expect(result.headers.get('Content-Security-Policy-Report-Only')).toBe(
      "default-src 'self' https://sentry.incubateur.net; script-src 'self' https://matomo.incubateur.anct.gouv.fr; script-src-attr 'none'; style-src 'self' https: 'unsafe-inline'; img-src 'self' data:; object-src 'none'; font-src 'self' https: data:; frame-ancestors 'self'; form-action 'self'; base-uri 'self'; upgrade-insecure-requests;",
    )
  })
})
