import { NextMiddleware, NextResponse } from 'next/server'

const middleware: NextMiddleware = (request) => {
  const forwardedProto = request.headers.get('X-Forwarded-Proto')
  const nodeEnv = process.env.NODE_ENV
  const requestHost = request.headers.get('host')
  const baseUrl = process.env.BASE_URL

  if (
    nodeEnv === 'production' &&
    // We redirect if protocol is not secure https
    (forwardedProto === 'http' ||
      // If we have a base url defined and the host is different
      // we redirect to the main domain defined in base_url
      (!!baseUrl && requestHost !== baseUrl))
  ) {
    const httpsBase = `https://${baseUrl || requestHost}`
    const requestUrl = new URL(request.url)
    const path = `${requestUrl.pathname}${requestUrl.search}`
    const redirectTo = `${httpsBase}${path}`

    return NextResponse.redirect(redirectTo)
  }

  const response = NextResponse.next()
  response.headers.append('X-Frame-Options', 'DENY')
  response.headers.append('X-Content-Type-Options', 'nosniff')
  response.headers.append('X-XSS-Protection', '1; mode=block')
  response.headers.delete('X-Powered-By')

  // TODO This CSP policy is too restrictive an account has been created in report-uri.com. Make this in another deployment.
  // TODO use https://www.npmjs.com/package/csp-header
  // https://report-uri.com
  // response.headers.append(
  //   'Content-Security-Policy',
  //   "default-src 'self'; script-src 'self'; script-src-elem 'self'; script-src-attr 'self'; style-src 'self'; style-src-elem 'self'; style-src-attr 'self'; img-src *; font-src 'self'; connect-src 'self'; media-src *; object-src 'self'; prefetch-src 'self'; child-src 'self'; frame-src 'self'; worker-src 'self'; frame-ancestors 'none'; form-action 'self'; base-uri 'self'; manifest-src 'self'",
  // )
  return response
}

export default middleware
