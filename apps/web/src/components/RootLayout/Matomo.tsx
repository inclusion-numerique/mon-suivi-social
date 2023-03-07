'use client'

import Script from 'next/script'

export function Matomo() {
  return process.env.NODE_ENV === 'production' ? (
    // FIXME: Is id useful ?
    // FIXME: We could also leave inline script and add a nonce
    <Script id="matomo" src="/matomo/matomo.js" strategy="lazyOnload" />
  ) : null
}
