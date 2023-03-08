import { NextRequest, NextResponse } from 'next/server'
import { generateContentSecurityPolicyScriptNonce } from '@mss/web/utils/generateContentSecurityPolicyScriptNonce'

const ContentSecurityPolicy = `
  default-src 'self' https://matomo.incubateur.anct.gouv.fr https://sentry.incubateur.net;
  script-src 'self' https://matomo.incubateur.anct.gouv.fr <<nonce>>;
  script-src-attr 'none';
  style-src 'self' https: 'unsafe-inline';
  img-src 'self' data:;
  object-src 'none';
  connect-src 'self' https://matomo.incubateur.anct.gouv.fr https://sentry.incubateur.net;
  worker-src 'self'; 
  font-src 'self' https: data:;
  frame-ancestors 'self';
  form-action 'self';
  base-uri 'self';
`
  .replace(/\s{2,}/g, ' ')
  .trim()

const middleware = (request: NextRequest) => {
  const forwardedProto = request.headers.get('X-Forwarded-Proto')
  const nodeEnvironment = process.env.NODE_ENV
  const isProd = nodeEnvironment === 'production'
  const requestHost = request.headers.get('host')
  const baseUrl = process.env.BASE_URL

  /**
   * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
   * The MDN documentation states "Note: This is more secure than simply
   * configuring a HTTP to HTTPS (301) redirect on your server, where the
   * initial HTTP connection is still vulnerable to a man-in-the-middle attack."
   * But they keep applying this redirect in recommended SSL configs: https://ssl-config.mozilla.org/
   */
  if (
    isProd &&
    // We redirect if protocol is not secure https
    (forwardedProto === 'http' ||
      // If we have a base url defined and the host is different
      // we redirect to the main domain defined in base_url
      (!!baseUrl && requestHost !== baseUrl))
  ) {
    const domain = baseUrl || requestHost
    const httpsBase = `https://${domain ?? ''}`
    const requestUrl = new URL(request.url)
    const path = `${requestUrl.pathname}${requestUrl.search}`
    const redirectTo = `${httpsBase}${path}`

    return NextResponse.redirect(redirectTo)
  }

  const nonce = generateContentSecurityPolicyScriptNonce()
  const cspNonceCondition = `'nonce-${nonce}'`

  const securityPolicyWithNonce = ContentSecurityPolicy
    // Add nonce conditions
    .replace(
      '<<nonce>>',
      isProd
        ? // Production only gets nonce
          cspNonceCondition
        : // Development server also needs eval
          `${cspNonceCondition} 'unsafe-eval'`,
    )

  // Add upgrade directive in prod environment
  const securityPolicy = isProd
    ? `${securityPolicyWithNonce}upgrade-insecure-requests true;`
    : securityPolicyWithNonce

  /**
   * CSP nonce configuration for next scripts is expected by next to be in request headers
   * Overriding request headers in middleware is the way Next internally handles request handling advanced configuration
   * This is not documented but for more information see next.js source code (next-server.ts::generateCatchAllMiddlewareRoute() and app-render.tsx)
   * Modified headers are NOT available in the reponse for the client
   */
  const response = NextResponse.next({
    request: {
      headers: new Headers({
        'content-security-policy': securityPolicy,
        // Custom header for use in server component
        'x-mss-script-nonce': nonce,
      }),
    },
  })

  if (nodeEnvironment === 'development') {
    response.headers.append('Access-Control-Allow-Headers', '*')
    response.headers.append('Access-Control-Allow-Origin', '*')
  }

  response.headers.append('X-Frame-Options', 'DENY')
  response.headers.append('X-Content-Type-Options', 'nosniff')
  response.headers.append('X-XSS-Protection', '1; mode=block')
  response.headers.delete('X-Powered-By')
  response.headers.append('Strict-Transport-Security', 'max-age=63072000')

  response.headers.append('Content-Security-Policy-Report-Only', securityPolicy)

  return response
}

export default middleware
