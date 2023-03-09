import { NextRequest } from 'next/server'
import middleware from './middleware'
import * as generateContentSecurityPolicyScriptNonceModule from '@mss/web/utils/generateContentSecurityPolicyScriptNonce'

describe('middleware', () => {
  const originalEnv = process.env
  const nonceGeneratorSpy = jest.spyOn(
    generateContentSecurityPolicyScriptNonceModule,
    'generateContentSecurityPolicyScriptNonce',
  )

  afterEach(() => {
    process.env = originalEnv
    nonceGeneratorSpy.mockReset()
  })

  it('Adds CSP headers in development environment', () => {
    nonceGeneratorSpy.mockReturnValue('ABCD')

    const result = middleware(new NextRequest('http://example.com/'))
    const cspHeader = result.headers.get('Content-Security-Policy')

    expect(nonceGeneratorSpy).toHaveBeenCalledOnce()
    expect(cspHeader).toBeString()
    expect(cspHeader).toInclude(
      "script-src 'self' https://matomo.incubateur.anct.gouv.fr 'nonce-ABCD' 'unsafe-eval';",
    )
  })

  it('Adds CSP headers in production environment', () => {
    process.env = { NODE_ENV: 'production' }
    nonceGeneratorSpy.mockReturnValue('1234')

    const result = middleware(new NextRequest('http://example.com/'))
    const cspHeader = result.headers.get('Content-Security-Policy')
    expect(nonceGeneratorSpy).toHaveBeenCalledOnce()
    expect(cspHeader).toBeString()
    expect(cspHeader).toInclude(
      "script-src 'self' https://matomo.incubateur.anct.gouv.fr 'nonce-1234';",
    )
    expect(cspHeader).not.toInclude('unsafe-eval')
  })
})
