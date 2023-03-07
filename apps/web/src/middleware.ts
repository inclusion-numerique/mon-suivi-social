import { NextRequest, NextResponse } from 'next/server'

// Build the CSP policy
function getCsp() {
  const csp = {
    'default-src': "'self' https://sentry.incubateur.net",
    'script-src': "'self' https://matomo.incubateur.anct.gouv.fr",
    'script-src-attr': "'none'",
    'style-src': "'self' https: 'unsafe-inline'",
    'img-src': "'self' data:",
    'object-src': "'none'",
    'font-src': "'self' https: data:",
    'frame-ancestors': "'self'",
    'form-action': "'self'",
    'base-uri': "'self'",
    'upgrade-insecure-requests': true,
  }

  return Object.entries(csp).reduce((_csp, [policy, source]) => {
    if (typeof source === 'boolean') return `${_csp} ${policy};`
    return `${_csp} ${policy} ${source};`
  }, '')
}

const middleware = (request: NextRequest) => {
  const forwardedProto = request.headers.get('X-Forwarded-Proto')
  const nodeEnvironment = process.env.NODE_ENV
  const isProd = nodeEnvironment === 'production'
  const requestHost = request.headers.get('host')
  const baseUrl = process.env.BASE_URL
  const useCsp = 0 && isProd // FIXME: CSP are disabled while waiting for Next 13 to support nonce feature on NextScript - See https://github.com/vercel/next.js/issues/42330

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

  const response = NextResponse.next()

  if (nodeEnvironment === 'development') {
    response.headers.append('Access-Control-Allow-Headers', '*')
    response.headers.append('Access-Control-Allow-Origin', '*')
  }

  response.headers.append('X-Frame-Options', 'DENY')
  response.headers.append('X-Content-Type-Options', 'nosniff')
  response.headers.append('X-XSS-Protection', '1; mode=block')
  response.headers.delete('X-Powered-By')
  response.headers.append('Strict-Transport-Security', 'max-age=63072000')

  if (useCsp)
    // FIXME: Replace with Content-Security-Policy
    response.headers.append('Content-Security-Policy-Report-Only', getCsp())

  return response
}

export default middleware
